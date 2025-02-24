using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.ProductCategory.Commands.Validator
{
    public class UpdateProductCategoryCommandValidator : AbstractValidator<UpdateProductCategoryCommand>
    {
        public UpdateProductCategoryCommandValidator()
        {
            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("CategoryId is required")
                .GreaterThanOrEqualTo((short)1).WithMessage("CategoryId must be greater than 0")
                .Must(x => short.TryParse(x.ToString(), out _)).WithMessage("CategoryId must be a valid number");
            RuleFor(x => x.CategoryName)
                .NotEmpty().WithMessage("CategoryName is required")
                .MaximumLength(100).WithMessage("CategoryName must not exceed 100 characters");
           
        }
    }
}