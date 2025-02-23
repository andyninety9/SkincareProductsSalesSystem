using System.Threading.Tasks;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Question.Commands.Response;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Question.Commands
{
    public sealed record UpdateQuestionCommand
   (
        short QuestionId,
        short? CateQuestionId,
        string? QuestionContent
   ) : ICommand<UpdateQuestionResponse>;

    internal sealed class UpdateQuestionCommandHandler : ICommandHandler<UpdateQuestionCommand, UpdateQuestionResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateQuestionCommandHandler> _logger;
        private readonly IQuestionRepository _questionRepository;

        public UpdateQuestionCommandHandler(
            IQuestionRepository questionRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateQuestionCommandHandler> logger)
        {

            _questionRepository = questionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;

        }

        public async Task<Result<UpdateQuestionResponse>> Handle(UpdateQuestionCommand command, CancellationToken cancellationToken)
        {
            var question = await _questionRepository.UpdateQuestionAsync(command.QuestionId, command.CateQuestionId, command.QuestionContent);
            
            if (question is null)
            {
                return Result<UpdateQuestionResponse>.Failure<UpdateQuestionResponse>(new Error("QuestionNotFound", "Question not found"));
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result<UpdateQuestionResponse>.Success(new UpdateQuestionResponse
            {
                QuestionId = question.QuestionId,
                CateQuestionId = question.CateQuestionId,
                QuestionContent = question.QuestionContent,
                StatusQuestion = question.StatusQuestion,
            });

        }


    }
}