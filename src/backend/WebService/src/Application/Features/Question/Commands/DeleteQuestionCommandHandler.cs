using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Question.Command.Response;
using Application.Features.Question.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace Application.Features.Question.Commands
{
    public sealed record DeleteQuestionCommand
    (
        short QuestionId
    ) : ICommand<DeleteQuestionResponse>;

    internal sealed class DeleteQuestionCommandHandler : ICommandHandler<DeleteQuestionCommand, DeleteQuestionResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteQuestionCommandHandler> _logger;
        private readonly IQuestionRepository _questionRepository;

        public DeleteQuestionCommandHandler(
            IQuestionRepository questionRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteQuestionCommandHandler> logger
         )
        {

            _questionRepository = questionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;

        }

        public async Task<Result<DeleteQuestionResponse>> Handle(DeleteQuestionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                
                bool isSuccess = await _questionRepository.DeleteByStatusAsync(command.QuestionId);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                if (isSuccess)
                {
                    var question = await _questionRepository.GetQuestionByIdAsync(command.QuestionId);
                    if (question == null)
                    {
                        return Result<DeleteQuestionResponse>.Failure<DeleteQuestionResponse>(new Error("DeleteQuestionError", "Error occurred while deleting question"));
                    }
                    return Result<DeleteQuestionResponse>.Success(new DeleteQuestionResponse
                    {
                        QuestionId = question.QuestionId,
                        CateQuestionId = question.CateQuestionId,
                        QuestionContent = question.QuestionContent,
                        StatusQuestion = question.StatusQuestion,
                    });
                }
            
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting question");
                return Result<DeleteQuestionResponse>.Failure<DeleteQuestionResponse>(new Error("DeleteQuestionError", "Error occurred while deleting question"));
            }
            
            return Result<DeleteQuestionResponse>.Failure<DeleteQuestionResponse>(new Error("DeleteQuestionError", "Failed to delete question"));
        }

        
    }
}