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
                .Must(date => date == null || date.Value != default)
                .WithMessage("From date must be a valid date.");

            // ✅ Kiểm tra ToDate nhưng chỉ khi nó được cung cấp
            RuleFor(x => x.ToDate)
                .Must(date => date == null || date.Value != default)
                .WithMessage("To date must be a valid date.");

            // ✅ Kiểm tra FromDate <= ToDate nhưng chỉ khi cả hai được cung cấp
            RuleFor(x => x)
                .Must(x => !x.FromDate.HasValue || !x.ToDate.HasValue || x.FromDate <= x.ToDate)
                .WithMessage("From date must be less than or equal to to date.");
        }
        
    }
}