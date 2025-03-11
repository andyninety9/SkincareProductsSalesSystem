using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Products.Commands.Validator
{
    public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(p => p.ProductName)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
            
            RuleFor(p => p.ProductDesc)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .MaximumLength(500).WithMessage("{PropertyName} must not exceed 500 characters.");
            
            RuleFor(p => p.Stocks)
                .GreaterThanOrEqualTo(0).WithMessage("{PropertyName} must be non-negative.");
            
            RuleFor(p => p.CostPrice)
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than zero.");
            
            RuleFor(p => p.SellPrice)
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than zero.")
                .GreaterThanOrEqualTo(p => p.CostPrice).WithMessage("{PropertyName} must be greater than or equal to Cost Price.");
            
            RuleFor(p => p.Ingredient)
                .NotEmpty().WithMessage("{PropertyName} is required.");
            
            RuleFor(p => p.Instruction)
                .NotEmpty().WithMessage("{PropertyName} is required.");
            
            RuleFor(p => p.ProdStatusId)
                .NotEmpty().WithMessage("{PropertyName} is required.");
            
            RuleFor(p => p.ProdUseFor)
                .NotEmpty().WithMessage("{PropertyName} is required.");
            
            RuleFor(p => p.CateId)
                .NotEmpty().WithMessage("{PropertyName} is required.");
            
            RuleFor(p => p.BrandId)
                .NotEmpty().WithMessage("{PropertyName} is required.");
        }
        
    }
}