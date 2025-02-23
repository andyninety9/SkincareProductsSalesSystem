using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Events.Queries
{
    public sealed record GetEventDetailByIdQuery(long EventId) : IQuery<GetEventDetailResponse>;

    internal sealed class GetEventDetailQueryHandler : IQueryHandler<GetEventDetailByIdQuery, GetEventDetailResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetEventDetailQueryHandler> _logger;
        private readonly IEventRepository _eventRepository;

        public GetEventDetailQueryHandler(
            IMapper mapper,
            ILogger<GetEventDetailQueryHandler> logger,
            IEventRepository eventRepository)
        {
            _mapper = mapper;
            _logger = logger;
            _eventRepository = eventRepository;
        }

        public async Task<Result<GetEventDetailResponse>> Handle(GetEventDetailByIdQuery request, CancellationToken cancellationToken)
        {
            var eventEntity = await _eventRepository.GetEventDetailByIdAsync(request.EventId);
            if (eventEntity is null)
            {
                _logger.LogWarning("Event with ID {EventId} not found", request.EventId);
                return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("NotFound", "Product not found."));
            }

            var response = _mapper.Map<GetEventDetailResponse>(eventEntity);
            return Result<GetEventDetailResponse>.Success(response);
            
        }
    }
}
