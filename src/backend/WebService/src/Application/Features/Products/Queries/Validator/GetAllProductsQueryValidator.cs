using FluentValidation;

namespace Application.Features.Products.Queries.Validator
{
    public class GetAllProductsQueryValidator : AbstractValidator<GetAllProductsQuery>
    {
        public GetAllProductsQueryValidator()
        {
            RuleFor(x => x.PaginationParams.Page)
                .GreaterThan(0)
                .WithMessage("Page must be greater than 0");

            RuleFor(x => x.PaginationParams.PageSize)
                .GreaterThan(0)
                .WithMessage("PageSize must be greater than 0");

            RuleFor(x => x.FromDate)
                .Must((model, fromDate) => string.IsNullOrEmpty(fromDate) || DateTime.TryParse(fromDate, out _))
                .WithMessage("FromDate must be in a valid date format (yyyy-MM-dd)")
                .When(x => !string.IsNullOrEmpty(x.FromDate));

            RuleFor(x => x.ToDate)
                .Must((model, toDate) => string.IsNullOrEmpty(toDate) || DateTime.TryParse(toDate, out _))
                .WithMessage("ToDate must be in a valid date format (yyyy-MM-dd)")
                .When(x => !string.IsNullOrEmpty(x.ToDate));

            RuleFor(x => x)
                .Must(x =>
                {
                    if (string.IsNullOrEmpty(x.FromDate) || string.IsNullOrEmpty(x.ToDate))
                        return true;

                    return DateTime.Parse(x.FromDate) <= DateTime.Parse(x.ToDate);
                })
                .WithMessage("FromDate must be less than or equal to ToDate")
                .When(x => !string.IsNullOrEmpty(x.FromDate) && !string.IsNullOrEmpty(x.ToDate));

            RuleFor(x => x.CateId)
                .GreaterThan(0)
                .WithMessage("CateId must be greater than 0")
                .When(x => x.CateId.HasValue);

            RuleFor(x => x.BrandId)
                .GreaterThan(0)
                .WithMessage("BrandId must be greater than 0")
                .When(x => x.BrandId.HasValue);
        }
    }
}
