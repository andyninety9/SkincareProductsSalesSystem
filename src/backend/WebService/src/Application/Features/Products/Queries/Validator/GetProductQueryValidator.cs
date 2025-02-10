using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Products.Queries;
using FluentValidation;

namespace Application.Features.Products.Queries.Validator
{
    public class GetProductQueryValidator: AbstractValidator<GetProductByIdQuery>
    {
        public GetProductQueryValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("ProductId is required");
            
        }
    }
}