using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Queries.Response;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Users.Queries
{
    public sealed record GetUserQuizHistoryQuery(
        long UserId,
        string? Keyword,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetUserQuizHistoryResponse>>;

    internal sealed class GetAllUserQuizHistoryQueryHandler : IQueryHandler<GetUserQuizHistoryQuery, PagedResult<GetUserQuizHistoryResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllUserQuizHistoryQueryHandler> _logger;
        private readonly IQuizRepository _quizRepository;
        private readonly IResultQuizRepository _resultQuizRepository;

        public GetAllUserQuizHistoryQueryHandler(
            IQuizRepository quizRepository,
            IMapper mapper,
            ILogger<GetAllUserQuizHistoryQueryHandler> logger,
            IResultQuizRepository resultQuizRepository)
        {
            _resultQuizRepository = resultQuizRepository;
            _quizRepository = quizRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetUserQuizHistoryResponse>>> Handle(GetUserQuizHistoryQuery request, CancellationToken cancellationToken)
        {
            try
            {

                var listResultQuiz = await _resultQuizRepository.GetListResultQuizByUserIdAsync(request.UserId, cancellationToken);
                List<GetUserQuizHistoryResponse> listResponse = new();
                var listQuiz = await _quizRepository.GetAllAsync(cancellationToken);

                foreach (var resultQuiz in listResultQuiz)
                {
                    if (resultQuiz.UsrId == request.UserId)
                    {
                        var quiz = listQuiz.FirstOrDefault(x => x.QuizId == resultQuiz.QuizId);
                        if (quiz != null)
                        {
                            var response = _mapper.Map<GetUserQuizHistoryResponse>(quiz);
                            listResponse.Add(response);
                        }
                    }
                }

                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    listResponse = listResponse.Where(x => x.QuizName.Contains(request.Keyword)).ToList();
                }

                var items = listResponse
                  .Skip((request.PaginationParams.Page - 1) * request.PaginationParams.PageSize)
                  .Take(request.PaginationParams.PageSize)
                  .ToList();

                var pagedResult = new PagedResult<GetUserQuizHistoryResponse>
                {
                    Items = items,
                    TotalItems = listResponse.Count,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };
                
                return Result.Success(pagedResult);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return Result.Failure<PagedResult<GetUserQuizHistoryResponse>>(new Error("Error", e.Message));
            }
        }

    }
}
