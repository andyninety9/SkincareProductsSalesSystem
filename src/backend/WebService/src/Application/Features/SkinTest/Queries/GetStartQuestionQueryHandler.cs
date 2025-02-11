using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Application.SkinTest.Queries
{
    public sealed record GetStartQuestionQuery(long UserId, string QuizName, string QuizDesc) : IQuery<GetStartQuestionResponse>;

    internal sealed class GetStartQuestionQueryHandler : IQueryHandler<GetStartQuestionQuery, GetStartQuestionResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetStartQuestionQueryHandler> _logger;
        private readonly IQuestionRepository _questionRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IResultQuizRepository _resultQuizRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetStartQuestionQueryHandler(
            IQuestionRepository questionRepository,
            IQuizRepository quizRepository,
            IResultQuizRepository resultQuizRepository,
            IMapper mapper,
            ILogger<GetStartQuestionQueryHandler> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _logger = logger;
            _questionRepository = questionRepository;
            _quizRepository = quizRepository;
            _resultQuizRepository = resultQuizRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Result<GetStartQuestionResponse>> Handle(GetStartQuestionQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching start question and creating a new quiz");

            var quizId = await _quizRepository.CreateNewQuizAsync(request.QuizName, request.QuizDesc);
            _logger.LogInformation($"Created new quiz with ID: {quizId}");

            await _resultQuizRepository.CreateNewResultAsync(quizId, request.UserId);


            // Lấy câu hỏi đầu tiên
            var categories = await _questionRepository.GetAllCategoriesAsync();
            var randomCategory = categories.OrderBy(c => Guid.NewGuid()).FirstOrDefault();
            var questions = await _questionRepository.GetQuestionsByCategoryAsync(randomCategory.CateQuestionId);
            var randomQuestion = questions.Where(q => q.KeyQuestions != null && q.KeyQuestions.Any())
                                        .OrderBy(q => Guid.NewGuid())
                                        .FirstOrDefault();

            var response = new GetStartQuestionResponse
            {
                QuizId = quizId,
                QuestionId = randomQuestion.QuestionId,
                QuestionText = randomQuestion.QuestionContent,
                Category = randomCategory.CateName,
                CreatedAt = randomQuestion.CreatedAt.ToDateTime(TimeOnly.MinValue),
                KeyQuestions = randomQuestion.KeyQuestions.Select(kq => new KeyQuestionResponse
                {
                    KeyId = kq.KeyId,
                    KeyContent = kq.KeyContent,
                    KeyScore = kq.KeyScore
                }).ToList()
            };

            return Result<GetStartQuestionResponse>.Success(response);
        }
    }
}
