using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Question.Command.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Question.Commands
{
    public sealed record CreateQuestionCommand
    (
        short CateQuestionId,
        string QuestionContent
    ) : ICommand<CreateQuestionResponse>;

    internal sealed class CreateQuestionCommandHandler : ICommandHandler<CreateQuestionCommand, CreateQuestionResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateQuestionCommandHandler> _logger;
        private readonly IQuestionRepository _questionRepository;
        private readonly IdGeneratorService _idGeneratorService;

        public CreateQuestionCommandHandler(
            IQuestionRepository questionRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateQuestionCommandHandler> logger,
            IdGeneratorService idGeneratorService
         )
        {

            _questionRepository = questionRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGeneratorService = idGeneratorService;

        }

        public async Task<Result<CreateQuestionResponse>> Handle(CreateQuestionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                Domain.Entities.Question question = new Domain.Entities.Question
                {
                    QuestionId = _idGeneratorService.GenerateShortId(),
                    CateQuestionId = command.CateQuestionId,
                    QuestionContent = command.QuestionContent,
                    StatusQuestion = true,
                    CreatedAt = DateOnly.FromDateTime(DateTime.Now)
                };
                _logger.LogInformation(question.CateQuestionId.ToString());
                await _questionRepository.AddAsync(question, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            
                return Result<CreateQuestionResponse>.Success(new CreateQuestionResponse
                {
                    CateQuestionId = question.CateQuestionId,
                    QuestionContent = question.QuestionContent
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Handle CreateQuestionCommand");
                
                return Result<CreateQuestionResponse>.Failure<CreateQuestionResponse>(new Error("Error", ex.Message));
            }

        }

        
    }
}