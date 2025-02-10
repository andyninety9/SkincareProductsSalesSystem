using System;
using Application.Products.Queries;
using FluentValidation;

namespace Application.Features.Reviews.Queries.Validator
{
    public class GetProductReviewsQueryValidator : AbstractValidator<GetAllProductReviewQuery>
    {
        public GetProductReviewsQueryValidator()
        {
            // ✅ ProductId phải lớn hơn 0
            RuleFor(x => x.ProductId)
                .GreaterThan(0)
                .WithMessage("ProductId must be greater than 0");

            // ✅ Pagination Validation
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

            // ✅ ToDate phải lớn hơn hoặc bằng FromDate
            RuleFor(x => x)
                .Must(x =>
                {
                    if (string.IsNullOrEmpty(x.FromDate) || string.IsNullOrEmpty(x.ToDate))
                        return true;

                    return DateTime.Parse(x.FromDate) <= DateTime.Parse(x.ToDate);
                })
                .WithMessage("FromDate must be less than or equal to ToDate")
                .When(x => !string.IsNullOrEmpty(x.FromDate) && !string.IsNullOrEmpty(x.ToDate));
        }

        private bool BeAValidDate(string date)
        {
            return DateTime.TryParse(date, out _);
        }
    }
}
