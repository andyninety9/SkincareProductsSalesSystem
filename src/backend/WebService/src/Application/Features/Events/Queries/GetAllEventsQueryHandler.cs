using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Events.Queries
{
    public sealed record GetAllEventsQuery(
        string? Keyword,
        bool? Status,
        DateTime? FromDate,
        DateTime? ToDate,
        PaginationParams PaginationParams) : IQuery<PagedResult<GetAllEventsResponse>>;

    internal sealed class GetAllEventsQueryHandler : IQueryHandler<GetAllEventsQuery, PagedResult<GetAllEventsResponse>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllEventsQueryHandler> _logger;

        public GetAllEventsQueryHandler(
            IEventRepository eventRepository,
            IMapper mapper,
            ILogger<GetAllEventsQueryHandler> logger)
        {
            _eventRepository = eventRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllEventsResponse>>> Handle(GetAllEventsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // ✅ Logging input parameters for debugging
                _logger.LogInformation("Processing GetAllEventsQuery: Keyword={Keyword}, Status={Status}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
                    request.Keyword, request.Status, request.FromDate, request.ToDate, request.PaginationParams.Page, request.PaginationParams.PageSize);

                // ✅ Kiểm tra nếu EventRepository bị NULL (nếu có vấn đề DI)
                if (_eventRepository == null)
                {
                    _logger.LogError("⚠️ _eventRepository is NULL! Check Dependency Injection.");
                    throw new NullReferenceException("_eventRepository is not initialized.");
                }

                // ✅ Xử lý phân trang hợp lý
                var page = request.PaginationParams?.Page ?? 1;
                var pageSize = request.PaginationParams?.PageSize ?? 10;

                // ✅ Đếm tổng số sự kiện phù hợp
                var totalCount = await _eventRepository.CountEventsAsync(
                    request.Keyword, request.Status, request.FromDate, request.ToDate
                );

                // ✅ Lấy danh sách sự kiện phù hợp với phân trang
                var events = (await _eventRepository.GetEventsAsync(
                    request.Keyword, request.Status, request.FromDate, request.ToDate, page, pageSize
                ))?.ToList() ?? new List<Event>();

                // ✅ Map từ Entity -> DTO để trả về
                var mappedEvents = _mapper.Map<List<GetAllEventsResponse>>(events);

                // ✅ Kết quả trả về dưới dạng PagedResult
                var result = new PagedResult<GetAllEventsResponse>
                {
                    Items = mappedEvents,
                    TotalItems = totalCount,
                    PageSize = pageSize,
                    Page = page
                };

                _logger.LogInformation("Returning {EventCount} events for page {Page}.", mappedEvents.Count, page);

                return Result<PagedResult<GetAllEventsResponse>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in GetAllEventsQueryHandler: {Message}", ex.Message);
                return Result<PagedResult<GetAllEventsResponse>>.Failure<PagedResult<GetAllEventsResponse>>(
                    new Error("GetAllEventsError", "An error occurred while retrieving events.")
                );
            }
        }

    }
}
