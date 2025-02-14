using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Orders.Queries.Validator
{
    public class GetAllUserOrdersHistoryQueryValidator : AbstractValidator<GetAllUserOrdersHistoryQuery>
    {
        
        public GetAllUserOrdersHistoryQueryValidator()
        {
            // Validate Page Number (>= 1)
            RuleFor(x => x.PaginationParams.Page)
                .GreaterThanOrEqualTo(1).WithMessage("Page number must be greater than or equal to 1.");

            // Validate Page Size (1 - 100)
            RuleFor(x => x.PaginationParams.PageSize)
                .InclusiveBetween(1, 100).WithMessage("Page size must be between 1 and 100.");

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
            if (DateTime.TryParse(fromDate, out var from) && DateTime.TryParse(toDate, out var to))
            {
                return from < to;
            }

            return true;
        }
        
    }
}