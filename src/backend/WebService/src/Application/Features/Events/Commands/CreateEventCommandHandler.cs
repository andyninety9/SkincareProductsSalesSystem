using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Events.Commands.Response;
using Application.Features.ProductCategory.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;
///     POST /api/events
///     {
///     "eventName": "string",
///     "startTime": "2021-01-01T00:00:00",
///     "endTime": "2021-01-01T00:00:00",
///     "eventDesc": "string",
///     "discountPercent": 35.5,
///     "statusEvent": true
///     }
namespace Application.Features.Events.Commands
{
    public sealed record CreateEventCommand
    (
        string EventName,
        string StartTime,
        string EndTime,
        string EventDesc,
        decimal DiscountPercent
        // bool StatusEvent
    ) : ICommand<CreateEventResponse>;

    internal sealed class CreateEventCommandHandler : ICommandHandler<CreateEventCommand, CreateEventResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateEventCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IEventRepository _eventRepository;

        public CreateEventCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateEventCommandHandler> logger,
            IdGeneratorService idGenerator, IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<CreateEventResponse>> Handle(CreateEventCommand command, CancellationToken cancellationToken)
        {
            try
            {
                Event newEvent = new()
                {
                    EventId = _idGenerator.GenerateLongId(),
                    EventName = command.EventName,
                    StartTime = DateTime.Parse(command.StartTime),
                    EndTime = DateTime.Parse(command.EndTime),
                    EventDesc = command.EventDesc,
                    DiscountPercent = (double)command.DiscountPercent,
                    StatusEvent = false
                };

                await _eventRepository.AddAsync(newEvent, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateEventResponse>.Success(_mapper.Map<CreateEventResponse>(newEvent));
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating event");
                return Result<CreateEventResponse>.Failure<CreateEventResponse>(new Error("Events.CreateError", e.Message));
            }
           
        }

    }
}
