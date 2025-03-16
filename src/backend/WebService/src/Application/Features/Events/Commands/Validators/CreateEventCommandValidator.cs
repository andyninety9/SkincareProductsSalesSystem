using FluentValidation;
using System.Globalization;

namespace Application.Features.Events.Commands.Validators
{
    public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
    {
        public CreateEventCommandValidator()
        {
            RuleFor(x => x.EventName)
                .NotEmpty().WithMessage("Event name is required.")
                .MaximumLength(100).WithMessage("Event name must not exceed 100 characters.");

            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("Start time is required.")
                .Must(BeValidIsoTimestamp).WithMessage("Start time must be in ISO timestamp format (e.g., 2025-03-16T12:30:00.000Z)");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("End time is required.")
                .Must(BeValidIsoTimestamp).WithMessage("End time must be in ISO timestamp format (e.g., 2025-03-16T12:30:00.000Z)");

            RuleFor(x => x.EventDesc)
                .MaximumLength(1000).WithMessage("Event description must not exceed 500 characters.");

            RuleFor(x => x.DiscountPercent)
                .InclusiveBetween(0, 100).WithMessage("Discount percent must be between 0 and 100.");

            // RuleFor(x => x.StatusEvent)
            //     .NotNull().WithMessage("Status event is required.");

        }

        private bool BeValidIsoTimestamp(string timestamp)
        {
            // Try to parse the timestamp as an ISO format string
            return DateTime.TryParse(timestamp,
                                    CultureInfo.InvariantCulture,
                                    DateTimeStyles.RoundtripKind,
                                    out _);
        }
    }
}