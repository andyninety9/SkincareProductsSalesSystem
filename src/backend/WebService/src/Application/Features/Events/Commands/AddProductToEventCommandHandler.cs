using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Events.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Events.Commands
{
    public sealed record AddProductToEventCommand
    (
        string EventId,
        string ProductId
    ) : ICommand<GetEventDetailResponse>;

    internal sealed class AddProductToEventCommandHandler : ICommandHandler<AddProductToEventCommand, GetEventDetailResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<AddProductToEventCommandHandler> _logger;
        private readonly IEventRepository _eventRepository;
        private readonly IProductRepository _productRepository;
        private readonly IEventDetailRepository _eventDetailRepository;
        private readonly IdGeneratorService _idGenerator;

        public AddProductToEventCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<AddProductToEventCommandHandler> logger,
            IEventRepository eventRepository,
            IProductRepository productRepository,
            IEventDetailRepository eventDetailRepository,
            IdGeneratorService idGenerator)
        {
            _idGenerator = idGenerator;
            _eventDetailRepository = eventDetailRepository;
            _eventRepository = eventRepository;
            _productRepository = productRepository;
            _eventRepository = eventRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<GetEventDetailResponse>> Handle(AddProductToEventCommand command, CancellationToken cancellationToken)
        {
            try
            {
                if (!long.TryParse(command.EventId, out var eventId))
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Invalid Event Id"));
                }

                if (!long.TryParse(command.ProductId, out var productId))
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Invalid Product Id"));
                }

                var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Event not found"));
                }

                if (eventEntity.StatusEvent)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Deactive event first to add product"));
                }

                var productEntity = await _productRepository.GetByIdAsync(productId, cancellationToken);
                if (productEntity == null)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Product not found"));
                }

                // Kiểm tra nếu sản phẩm đã có trong sự kiện
                var isExist = await _eventDetailRepository.ExistsAsync(eventId, productId);
                if (isExist)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Product already added to event"));
                }

                // Kiểm tra sản phẩm có đang nằm trong sự kiện khác không, nếu có thì kiểm tra xem sự kiện đó có end chưa
                var isExistInAnotherEvent = await _eventRepository.ExistsInAnotherEventAsync(productId, eventId);
                _logger.LogInformation($"Product {productId} isExistInAnotherEvent: {isExistInAnotherEvent}");
                if (isExistInAnotherEvent)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Product already added to another event"));
                }

                var eventDetail = new EventDetail
                {
                    EventDetailId = _idGenerator.GenerateLongId(),
                    EventId = eventId,
                    ProductId = productId
                };
                // Thêm mới EventDetail
                await _eventDetailRepository.AddAsync(eventDetail, cancellationToken);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var addedEvent = await _eventRepository.GetEventDetailByIdAsync(eventId);
                if (addedEvent == null)
                {
                    return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.AddProduct", "Event not found"));
                }

                var response = _mapper.Map<GetEventDetailResponse>(addedEvent);
                return Result<GetEventDetailResponse>.Success(response);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while updating event");
                return Result<GetEventDetailResponse>.Failure<GetEventDetailResponse>(new Error("Events.Update", e.Message));
            }
        }


    }
}
