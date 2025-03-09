using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Question.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Commands
{
    public sealed record CreateAnswerCommand
    (
        string QuestionId,
        string keyContent,
        string keyScore
    ) : ICommand<CreateAnswerQuestionResponse>;

    internal sealed class CreateAnswerCommandHandler : ICommandHandler<CreateAnswerCommand, CreateAnswerQuestionResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateAnswerCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IKeyQuestionRepository _keyQuestionRepository;

        public CreateAnswerCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateAnswerCommandHandler> logger,
            IdGeneratorService idGenerator, IKeyQuestionRepository keyQuestionRepository)
        {
            _keyQuestionRepository = keyQuestionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<CreateAnswerQuestionResponse>> Handle(CreateAnswerCommand command, CancellationToken cancellationToken)
        {
            try
            {
                KeyQuestion newKeyQuestion = new()
                {
                    KeyId = _idGenerator.GenerateShortId(),
                    QuestionId = short.Parse(command.QuestionId),
                    KeyContent = command.keyContent,
                    KeyScore = short.Parse(command.keyScore),
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
                };

                await _keyQuestionRepository.AddAsync(newKeyQuestion, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var result = _keyQuestionRepository.GetKeyQuestionByQuestionId(newKeyQuestion.QuestionId);
                List<KeyQuestionResponse> keyQuestions = new();
                foreach (var keyQuestion in result.Result)
                {
                    keyQuestions.Add(_mapper.Map<KeyQuestionResponse>(keyQuestion));
                }

                return Result<CreateAnswerQuestionResponse>.Success(new CreateAnswerQuestionResponse
                {
                    QuestionId = newKeyQuestion.QuestionId,
                    KeyQuestions = keyQuestions
                });
                
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating answer.");
                return Result<CreateAnswerQuestionResponse>.Failure<CreateAnswerQuestionResponse>(new Error("ProductCategory.CreateError", e.Message));
            }
        }

    }
}
