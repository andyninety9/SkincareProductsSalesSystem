using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Products.Commands.Validator
{
    public class DeleteProductCommandValidator:AbstractValidator<DeleteProductCommand>
    {
        public DeleteProductCommandValidator()
        {
            RuleFor(x => x.ProdId).NotEmpty().WithMessage("Product Id is required");
        }
        
    }
}