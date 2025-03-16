using FluentValidation;
using System.Globalization;

namespace Application.Features.Events.Commands.Validators
{
    public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
    {
        public CreateEventCommandValidator()
        {
            RuleFor(x => x.EventName)
                .NotEmpty().WithMessage("Event Name is required")
                .NotNull()
                .MaximumLength(100).WithMessage("Event Name must not exceed 100 characters");

            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("Start Time is required")
                .NotNull()
                .Must(BeValidIso8601String).WithMessage("Start Time must be a valid ISO8601 formatted string")
                .Must(BeGreaterThanCurrentTime).WithMessage("Start Time must be greater than current time");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("End Time is required")
                .NotNull()
                .Must(BeValidIso8601String).WithMessage("End Time must be a valid ISO8601 formatted string")
                .Must((command, endTime) => BeGreaterThan(endTime, command.StartTime)).WithMessage("End Time must be greater than Start Time");


            RuleFor(x => x.DiscountPercent)
                .NotEmpty().WithMessage("Discount Percent is required")
                .NotNull()
                .InclusiveBetween(0, 100).WithMessage("Discount Percent must be between 0 and 100");

            RuleFor(x => x.StatusEvent)
                .NotNull().WithMessage("Status Event is required");
        }
        
        private bool BeValidIso8601String(string dateTimeStr)
        {
            return DateTime.TryParse(dateTimeStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out _);
        }
        
        private bool BeGreaterThanCurrentTime(string dateTimeStr)
        {
            if (DateTime.TryParse(dateTimeStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime dateTime))
            {
                return dateTime > DateTime.UtcNow;
            }
            return false;
        }
        
        private bool BeGreaterThan(string endTimeStr, string startTimeStr)
        {
            if (DateTime.TryParse(endTimeStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime endTime) &&
                DateTime.TryParse(startTimeStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime startTime))
            {
                return endTime > startTime;
            }
            return false;
        }
    }
}