using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.SkinTypes.Queries.Validator
{
    public class GetAllSkinTypesQueryValidator: AbstractValidator<GetAllSkinTypesQuery>
    {
        public GetAllSkinTypesQueryValidator()
        {
            RuleFor(x => x.PaginationParams.Page)
                  .GreaterThan(0)
                  .WithMessage("Page must be greater than 0");

            RuleFor(x => x.PaginationParams.PageSize)
                .GreaterThan(0)
                .WithMessage("PageSize must be greater than 0");
        }
    }
}