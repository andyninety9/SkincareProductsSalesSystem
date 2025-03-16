using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Application.Features.Events.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Events.Commands
{
    public sealed record InactiveEventCommand
    (
        string EventId
    ) : ICommand<GetEventDetailResponse>;

    internal sealed class InActiveEventCommandHandler : ICommandHandler<InactiveEventCommand, GetEventDetailResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<InActiveEventCommandHandler> _logger;
        private readonly IEventRepository _eventRepository;
        private readonly IEventDetailRepository _eventDetailRepository;
        private readonly IProductRepository _productRepository;

        public InActiveEventCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<InActiveEventCommandHandler> logger,
            IEventRepository eventRepository,
            IEventDetailRepository eventDetailRepository,
            IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _eventDetailRepository = eventDetailRepository;
            _eventRepository = eventRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<GetEventDetailResponse>> Handle(InactiveEventCommand command, CancellationToken cancellationToken)
        {
            try
            {
                if (!long.TryParse(command.EventId, out var eventId))
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Invalid Event Id"));
                }

                var currentEvent = await _eventRepository.GetByIdAsync(eventId, cancellationToken);
                if (currentEvent == null)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Event not found"));
                }

                if (!currentEvent.StatusEvent)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Event has been Inactivated"));
                }

                if (currentEvent.EndTime < DateTime.Now)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Event has ended"));
                }

                if (currentEvent.StartTime > DateTime.Now)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Event has not started yet"));
                }

                var eventDetails = (await _eventDetailRepository.GetListEventDetailByEventIdAsync(eventId, cancellationToken)).ToList();
                if (!eventDetails.Any())
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", "Please add product to event"));
                }

                // **Lấy danh sách tất cả sản phẩm cần cập nhật**
                foreach (var eventDetail in eventDetails)
                {
                    var product = await _productRepository.GetByIdAsync(eventDetail.ProductId, cancellationToken);
                    if (product == null)
                    {
                        _logger.LogWarning($"Product {eventDetail.ProductId} not found, skipping...");
                        continue;
                    }

                    // **Cập nhật giá khuyến mãi**
                    product.DiscountedPrice = null;

                    // **Lưu từng sản phẩm ngay lập tức**
                    _productRepository.Update(product);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }

                // **Cập nhật trạng thái event**
                if (currentEvent.StatusEvent)
                {
                    currentEvent.StatusEvent = false;
                    _eventRepository.Update(currentEvent);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
                var eventEntity = await _eventRepository.GetEventDetailByIdAsync(eventId);
                return Result<GetEventDetailResponse>.Success(_mapper.Map<GetEventDetailResponse>(eventEntity));

            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while updating event");
                return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", e.Message));
            }
        }



    }
}
