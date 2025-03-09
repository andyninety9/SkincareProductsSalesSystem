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
    public sealed record DeleteAnswerCommand
    (
        short keyId
    ) : ICommand<CreateAnswerQuestionResponse>;

    internal sealed class DeleteAnswerCommandHandler : ICommandHandler<DeleteAnswerCommand, CreateAnswerQuestionResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteAnswerCommandHandler> _logger;
        private readonly IKeyQuestionRepository _keyQuestionRepository;

        public DeleteAnswerCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteAnswerCommandHandler> logger,
            IKeyQuestionRepository keyQuestionRepository)
        {
            _keyQuestionRepository = keyQuestionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateAnswerQuestionResponse>> Handle(DeleteAnswerCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var keyQuestion = await _keyQuestionRepository.GetKeyQuestionByKeyIdAsync(command.keyId, cancellationToken);
                if (keyQuestion == null)
                {
                    return Result<CreateAnswerQuestionResponse>.Failure<CreateAnswerQuestionResponse>(new Error("KeyQuestionNotFound", "Key question not found"));
                }

                keyQuestion.KeyQuestionStatus = false;
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
                _logger.LogError(ex, "Error occurred while deleting answer.");
                return Result<CreateAnswerQuestionResponse>.Failure<CreateAnswerQuestionResponse>(new Error("DeleteAnswerError", "Error occurred while deleting answer"));
            }
            
        }
        

    }
}
