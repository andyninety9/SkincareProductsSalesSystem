using System;
using System.Collections.Generic;
using System.Linq;
using Application.Orders.Queries;
using FluentValidation;

namespace Application.Features.Orders.Queries.Validator
{
    public class GetAllOrdersQueryValidator : AbstractValidator<GetAllOrdersQuery>
    {
        private static readonly List<string> ValidStatuses = new List<string>
        {
            "Pending", "Processing", "Shipping", "Shipped", "Completed", "Cancelled", "Refunded", "Return Requested",
            "Return Processing", "Returned", "Return Rejected"
        };

        public GetAllOrdersQueryValidator()
        {
            // Validate Page Number (>= 1)
            RuleFor(x => x.PaginationParams.Page)
                .GreaterThanOrEqualTo(1).WithMessage("Page number must be greater than or equal to 1.");

            // Validate Page Size (1 - 100)
            RuleFor(x => x.PaginationParams.PageSize)
                .InclusiveBetween(1, 100).WithMessage("Page size must be between 1 and 100.");

            // Validate Status (Nếu có)
            RuleFor(x => x.Status)
                .Must(status => string.IsNullOrEmpty(status) || ValidStatuses.Contains(status))
                .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}");

            // Validate CustomerId (Nếu có)
            RuleFor(x => x.CustomerId)
                .GreaterThan(0).When(x => x.CustomerId.HasValue)
                .WithMessage("CustomerId must be greater than 0.");

            // Validate EventId (Nếu có)
            RuleFor(x => x.EventId)
                .GreaterThan(0).When(x => x.EventId.HasValue)
                .WithMessage("EventId must be greater than 0.");

            // Validate FromDate (Nếu có)
            RuleFor(x => x.FromDate)
                .Must(BeValidDate)
                .When(x => !string.IsNullOrEmpty(x.FromDate))
                .WithMessage("FromDate must be a valid date in format yyyy-MM-dd.");

            // Validate ToDate (Nếu có)
            RuleFor(x => x.ToDate)
                .Must(BeValidDate)
                .When(x => !string.IsNullOrEmpty(x.ToDate))
                .WithMessage("ToDate must be a valid date in format yyyy-MM-dd.");

            // Validate FromDate < ToDate
            RuleFor(x => x)
                .Must(x => IsValidDateRange(x.FromDate, x.ToDate))
                .WithMessage("FromDate must be earlier than ToDate.");
        }

        private bool BeValidDate(string? date)
        {
            return DateTime.TryParse(date, out _);
        }

        private bool IsValidDateRange(string? fromDate, string? toDate)
        {
            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
                return true; // Không có giá trị để kiểm tra

            return DateTime.Parse(fromDate) <= DateTime.Parse(toDate);
        }
    }
}
