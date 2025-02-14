using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Events.Queries.Validator
{
    public class GetAllEventsQueryValidator : AbstractValidator<GetAllEventsQuery>
    {
        public GetAllEventsQueryValidator()
        {
            RuleFor(x => x.PaginationParams.Page)
                .GreaterThanOrEqualTo(1)
                .WithMessage("Page must be greater than or equal to 1.");

            RuleFor(x => x.PaginationParams.PageSize)
                .InclusiveBetween(1, 100)
                .WithMessage("Page size must be between 1 and 100.");

            RuleFor(x => x.FromDate)
                .Must(date => date.HasValue)
                .WithMessage("From date must be a valid date.")
                .LessThanOrEqualTo(x => x.ToDate)
                .WithMessage("From date must be less than or equal to to date.");

            RuleFor(x => x.ToDate)
                .Must(date => date.HasValue)
                .WithMessage("To date must be a valid date.");
        }
        
    }
}