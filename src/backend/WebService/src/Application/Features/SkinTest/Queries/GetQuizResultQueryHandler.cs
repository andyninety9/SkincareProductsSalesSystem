using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.SkinTest.Queries
{
    public sealed record GetQuizResultQuery(long UserId, long QuizId) : IQuery<GetQuizResultResponse>;

    internal sealed class GetQuizResultQueryHandler : IQueryHandler<GetQuizResultQuery, GetQuizResultResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetQuizResultQueryHandler> _logger;
        private readonly IQuestionRepository _questionRepository;
        private readonly IResultQuizRepository _resultQuizRepository;
        private readonly IQuizRepository _quizRepository;

        public GetQuizResultQueryHandler(
            IQuestionRepository questionRepository,
            IResultQuizRepository resultQuizRepository,
            IMapper mapper,
            ILogger<GetQuizResultQueryHandler> logger,
            IQuizRepository quizRepository)
        {
            _mapper = mapper;
            _logger = logger;
            _questionRepository = questionRepository;
            _resultQuizRepository = resultQuizRepository;
            _quizRepository = quizRepository;
        }

        public async Task<Result<GetQuizResultResponse>> Handle(GetQuizResultQuery request, CancellationToken cancellationToken)
        {
            var resultQuiz = await _resultQuizRepository.GetByQuizIdAsync(request.QuizId);

            return Result<GetQuizResultResponse>.Success(resultQuiz);
           
        }

    }



}
