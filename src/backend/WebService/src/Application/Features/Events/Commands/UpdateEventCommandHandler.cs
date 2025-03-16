using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Application.Features.Events.Commands.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Events.Commands
{
    public sealed record UpdateEventCommand
    (
        string EventId,
        string? EventName,
        string? StartTime,
        string? EndTime,
        string? EventDesc,
        decimal? DiscountPercent,
        bool? StatusEvent
    ) : ICommand<CreateEventResponse>;

    internal sealed class UpdateEventCommandHandler : ICommandHandler<UpdateEventCommand, CreateEventResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateEventCommandHandler> _logger;
        private readonly IEventRepository _eventRepository;

        public UpdateEventCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateEventCommandHandler> logger,
            IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateEventResponse>> Handle(UpdateEventCommand command, CancellationToken cancellationToken)
        {
            try
            {
                long eventId = long.Parse(command.EventId);
                var existingEvent = await _eventRepository.GetByIdAsync(eventId, cancellationToken);
                if (existingEvent == null)
                {
                    return Result<CreateEventResponse>.Failure<CreateEventResponse>(new Error("Events.Update", "Event not found"));
                }

                if (command.EventName != null)
                {
                    existingEvent.EventName = command.EventName;
                }

                if (command.StartTime != null)
                {
                    existingEvent.StartTime = DateTime.Parse(command.StartTime);
                }

                if (command.EndTime != null)
                {
                    existingEvent.EndTime = DateTime.Parse(command.EndTime);
                }

                if (command.EventDesc != null)
                {
                    existingEvent.EventDesc = command.EventDesc;
                }

                if (command.DiscountPercent != null)
                {
                    existingEvent.DiscountPercent = (double)command.DiscountPercent.Value;
                }

                if (command.StatusEvent != null)
                {
                    existingEvent.StatusEvent = command.StatusEvent.Value;
                }

                _eventRepository.Update(existingEvent);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateEventResponse>.Success(_mapper.Map<CreateEventResponse>(existingEvent));
                
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while Update Event");
                return Result<CreateEventResponse>.Failure<CreateEventResponse>(new Error("Events.Update", e.Message));
            }
           
        }

    }
}
