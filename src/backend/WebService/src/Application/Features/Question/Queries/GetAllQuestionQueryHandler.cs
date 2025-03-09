using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Linq.Expressions;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Queries.Response;
using Application.Features.Products.Response;
using Application.Features.Question.Queries.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Domain.DTOs;
using System.Text;
using System.Globalization;

namespace Application.Features.ProductCategory.Queries
{
    public sealed record GetAllQuestionQuery(
        string? Keyword,
        string? cateQuestionId,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllQuestionResponse>>;

    internal sealed class GetAllQuestionQueryHandler : IQueryHandler<GetAllQuestionQuery, PagedResult<GetAllQuestionResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllQuestionQueryHandler> _logger;
        private readonly IQuestionRepository _questionRepository;
        private readonly IKeyQuestionRepository _keyQuestionRepository;

        public GetAllQuestionQueryHandler(
            IQuestionRepository questionRepository,
            IKeyQuestionRepository keyQuestionRepository,
            IMapper mapper,
            ILogger<GetAllQuestionQueryHandler> logger)
        {
            _keyQuestionRepository = keyQuestionRepository;
            _questionRepository = questionRepository;
            _mapper = mapper;
            _logger = logger;
        }
        private string NormalizeVietnamese(string text)
        {
            if (string.IsNullOrEmpty(text))
                return string.Empty;

            string normalizedString = text.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            return sb.ToString().Normalize(NormalizationForm.FormC).ToLower();
        }
        public async Task<Result<PagedResult<GetAllQuestionResponse>>> Handle(GetAllQuestionQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = await _questionRepository.GetAllAsync(cancellationToken);
                var questionsList = query.ToList();

                questionsList = questionsList
                    .Where(x => x.StatusQuestion == true)
                    .OrderByDescending(x => x.CreatedAt)
                    .ToList();
                
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    string normalizedKeyword = NormalizeVietnamese(request.Keyword);
                    string[] searchTerms = normalizedKeyword.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                    questionsList = questionsList
                        .Where(x => x.QuestionContent != null &&
                            searchTerms.Any(term => NormalizeVietnamese(x.QuestionContent)
                                .Contains(term, StringComparison.OrdinalIgnoreCase)))
                        .ToList();
                }
                if(!string.IsNullOrEmpty(request.cateQuestionId))
                {
                    questionsList = questionsList
                        .Where(x => x.CateQuestionId == short.Parse(request.cateQuestionId))
                        .ToList();
                }

                var totalItems = questionsList.Count;
                var items = questionsList
                    .Skip(request.PaginationParams.Page * request.PaginationParams.PageSize)
                    .Take(request.PaginationParams.PageSize)
                    .ToList();



                List<GetAllQuestionResponse> listQuestion = new();
                foreach (var item in items)
                {
                    var keyQuestions = await _keyQuestionRepository.GetAllAsync(cancellationToken);
                    keyQuestions = keyQuestions.Where(x => x.QuestionId == item.QuestionId && x.KeyQuestionStatus == true).ToList();

                    var response = _mapper.Map<GetAllQuestionResponse>(item);
                    List<KeyQuestionResponse> keyQuestionResponses = new();
                    foreach (var keyQuestion in keyQuestions)
                    {
                        keyQuestionResponses.Add(_mapper.Map<KeyQuestionResponse>(keyQuestion));
                    }
                    listQuestion.Add(response);
                }
                var result = new PagedResult<GetAllQuestionResponse>
                {
                    Items = listQuestion,
                    TotalItems = totalItems,
                    PageSize = request.PaginationParams.PageSize,
                    Page = request.PaginationParams.Page
                };
                
                return Result.Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error in GetAllQuestionQueryHandler");
                return Result.Failure<PagedResult<GetAllQuestionResponse>>(new Error("GetAllQuestionError", "Error in GetAllQuestionQueryHandler"));
            }
            
           
        }

    }
}
