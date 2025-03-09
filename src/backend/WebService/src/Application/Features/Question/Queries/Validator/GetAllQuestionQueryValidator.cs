using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Queries;
using FluentValidation;

namespace Application.Features.Question.Queries.Validator
{
    public class GetAllQuestionQueryValidator: AbstractValidator<GetAllQuestionQuery>
    {
        public GetAllQuestionQueryValidator()
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