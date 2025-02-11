using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Products.Queries
{
    public sealed record GetNextQuestionQuery(long QuizId, int QuestionId, int AnswerId) : IQuery<GetNextQuestionResponse>;

    internal sealed class GetNextQuestionQueryHandler : IQueryHandler<GetNextQuestionQuery, GetNextQuestionResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetNextQuestionQueryHandler> _logger;
        private readonly IQuestionRepository _questionRepository;
        private readonly IResultQuizRepository _resultQuizRepository;
        private readonly IQuizRepository _quizRepository;

        public GetNextQuestionQueryHandler(
            IQuestionRepository questionRepository,
            IResultQuizRepository resultQuizRepository,
            IMapper mapper,
            ILogger<GetNextQuestionQueryHandler> logger,
            IQuizRepository quizRepository)
        {
            _mapper = mapper;
            _logger = logger;
            _questionRepository = questionRepository;
            _resultQuizRepository = resultQuizRepository;
            _quizRepository = quizRepository;
        }

        public async Task<Result<GetNextQuestionResponse>> Handle(GetNextQuestionQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Processing next question for quizId={request.QuizId}, questionId={request.QuestionId}");

            // ✅ 1. Lưu câu trả lời vào QuizDetail
            await _quizRepository.SaveUserAnswerAsync(request.QuizId, request.QuestionId);

            // ✅ 2. Lấy danh sách câu hỏi đã trả lời
            

            // ✅ 3. Lấy câu hỏi tiếp theo trong cùng category, tránh câu hỏi đã trả lời
            var currentQuestion = await _questionRepository.GetByIdAsync(request.QuestionId, cancellationToken);

            // Lấy danh sách câu hỏi đã trả lời từ QuizDetail
            var answeredQuestions = await _quizRepository.GetAnsweredQuestionsAsync(request.QuizId);

            // Gọi đúng hàm với quizId
            var nextQuestion = await _questionRepository.GetNextQuestionInCategoryAsync(currentQuestion.CateQuestionId, request.QuizId);

            if (nextQuestion == null)
            {
                return Result<GetNextQuestionResponse>.Failure<GetNextQuestionResponse>(new Error("NoMoreQuestions", "No more questions available."));
            }

            return Result<GetNextQuestionResponse>.Success(new GetNextQuestionResponse
            {
                QuestionId = nextQuestion.QuestionId,
                QuestionText = nextQuestion.QuestionContent,
                KeyQuestions = nextQuestion.KeyQuestions.Select(kq => new KeyQuestionResponse
                {
                    KeyId = kq.KeyId,
                    KeyContent = kq.KeyContent,
                    KeyScore = kq.KeyScore
                }).ToList()
            });
        }

    }



}
