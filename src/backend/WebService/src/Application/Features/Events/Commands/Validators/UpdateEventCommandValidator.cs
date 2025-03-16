using System;
using System.Globalization;
using FluentValidation;

namespace Application.Features.Events.Commands.Validators
{
    public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
    {
        public UpdateEventCommandValidator()
        {
            RuleFor(x => x.EventId)
                .NotEmpty().WithMessage("Event Id is required.");

            RuleFor(x => x.EventName)
                .MaximumLength(100).WithMessage("Event name must not exceed 100 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.EventName)); // Chỉ validate nếu có dữ liệu

            RuleFor(x => x.StartTime)
                .Must(BeValidIsoTimestamp).WithMessage("Start time must be in ISO timestamp format (e.g., 2025-03-16T12:30:00.000Z)")
                .When(x => !string.IsNullOrWhiteSpace(x.StartTime));

            RuleFor(x => x.EndTime)
                .Must(BeValidIsoTimestamp).WithMessage("End time must be in ISO timestamp format (e.g., 2025-03-16T12:30:00.000Z)")
                .When(x => !string.IsNullOrWhiteSpace(x.EndTime));

            RuleFor(x => x.EventDesc)
                .MaximumLength(1000).WithMessage("Event description must not exceed 1000 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.EventDesc));

            RuleFor(x => x.DiscountPercent)
                .InclusiveBetween(0, 100).WithMessage("Discount percent must be between 0 and 100.")
                .When(x => x.DiscountPercent.HasValue); // Chỉ kiểm tra nếu có giá trị

            // RuleFor(x => x.StatusEvent)
            //     .NotNull().WithMessage("Status event is required.")
            //     .When(x => x.StatusEvent.HasValue); // Chỉ kiểm tra nếu có giá trị
        }

        private bool BeValidIsoTimestamp(string timestamp)
        {
            return DateTime.TryParse(timestamp, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out _);
        }
    }
}
