using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.ProductCategory.Commands.Validator
{
    public class CreateProductCategoryCommandValidator : AbstractValidator<CreateProductCategoryCommand>
    {
        public CreateProductCategoryCommandValidator()
        {
            RuleFor(x => x.CategoryName)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");
        }
    }
}