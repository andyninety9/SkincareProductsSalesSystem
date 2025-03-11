using Application.Features.ProductCategory.Queries;
using FluentValidation;

namespace Application.Features.Brand.Queries.Validator
{
    public class GetAllProductCategoryQueryValidator : AbstractValidator<GetAllProductCategoryQuery>
    {
        public GetAllProductCategoryQueryValidator()
        {
            RuleFor(x => x.PaginationParams.Page).GreaterThan(0);
            RuleFor(x => x.PaginationParams.PageSize).GreaterThan(0);
        }
        
    }
}