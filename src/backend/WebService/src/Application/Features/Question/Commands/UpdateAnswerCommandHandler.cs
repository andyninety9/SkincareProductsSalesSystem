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
    public sealed record UpdateAnswerCommand
    (
        string  keyId,
        string? keyContent,
        string? keyScore

    ) : ICommand<CreateAnswerQuestionResponse>;

    internal sealed class UpdateAnswerCommandHandler : ICommandHandler<UpdateAnswerCommand, CreateAnswerQuestionResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateAnswerCommandHandler> _logger;
        private readonly IKeyQuestionRepository _keyQuestionRepository;

        public UpdateAnswerCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateAnswerCommandHandler> logger,
            IKeyQuestionRepository keyQuestionRepository)
        {
            _keyQuestionRepository = keyQuestionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateAnswerQuestionResponse>> Handle(UpdateAnswerCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var keyQuestion = await _keyQuestionRepository.GetKeyQuestionByKeyIdAsync(short.Parse(command.keyId), cancellationToken);
                if (keyQuestion == null)
                {
                    return Result<CreateAnswerQuestionResponse>.Failure<CreateAnswerQuestionResponse>(new Error("Question.NotFound", "Question not found"));
                }

                keyQuestion.KeyContent = command.keyContent ?? keyQuestion.KeyContent;
                keyQuestion.KeyScore = command.keyScore != null ? short.Parse(command.keyScore) : keyQuestion.KeyScore;

                _keyQuestionRepository.Update(keyQuestion);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var result = _keyQuestionRepository.GetKeyQuestionByQuestionId(keyQuestion.QuestionId);
                List<KeyQuestionResponse> keyQuestions = new();
                foreach (var item in result.Result)
                {
                    keyQuestions.Add(_mapper.Map<KeyQuestionResponse>(item));
                }
                return Result<CreateAnswerQuestionResponse>.Success(new CreateAnswerQuestionResponse
                {
                    QuestionId = keyQuestion.QuestionId,
                    KeyQuestions = keyQuestions
                });
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateAnswerCommandHandler");
                return Result<CreateAnswerQuestionResponse>.Failure<CreateAnswerQuestionResponse>(new Error("Question.CreateError", ex.Message));
            }
        }

    }
}
