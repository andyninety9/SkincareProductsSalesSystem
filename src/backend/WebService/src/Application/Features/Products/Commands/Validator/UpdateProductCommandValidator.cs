using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Products.Commands.Validator
{
    public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductCommandValidator()
        {
            RuleFor(p => p.ProductId)
            .NotEmpty().WithMessage("{PropertyName} is required.");
            
            When(p => p.ProductName != null, () => {
            RuleFor(p => p.ProductName)
                .Must(name => !string.IsNullOrEmpty(name)).WithMessage("{PropertyName} is required.")
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
            });
            
            When(p => p.ProductDesc != null, () => {
            RuleFor(p => p.ProductDesc)
                .Must(desc => !string.IsNullOrEmpty(desc)).WithMessage("{PropertyName} is required.")
                .MaximumLength(500).WithMessage("{PropertyName} must not exceed 500 characters.");
            });
            
            When(p => p.Stocks.HasValue, () => {
            RuleFor(p => p.Stocks)
                .GreaterThanOrEqualTo(0).WithMessage("{PropertyName} must be non-negative.");
            });
            
            When(p => p.CostPrice.HasValue, () => {
            RuleFor(p => p.CostPrice)
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than zero.");
            });
            
            When(p => p.SellPrice.HasValue, () => {
            RuleFor(p => p.SellPrice)
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than zero.")
                .GreaterThanOrEqualTo(p => p.CostPrice.Value).When(p => p.CostPrice.HasValue);
            });
            
            When(p => p.Ingredient != null, () => {
            RuleFor(p => p.Ingredient)
                .Must(ingredient => !string.IsNullOrEmpty(ingredient)).WithMessage("{PropertyName} is required.");
            });
            
            When(p => p.Instruction != null, () => {
            RuleFor(p => p.Instruction)
                .Must(instruction => !string.IsNullOrEmpty(instruction)).WithMessage("{PropertyName} is required.");
            });
            
            When(p => p.ProdStatusId.HasValue, () => {
            RuleFor(p => p.ProdStatusId)
                .Must(id => id > 0).WithMessage("{PropertyName} is required.");
            });
            
            When(p => p.ProdUseFor != null, () => {
            RuleFor(p => p.ProdUseFor)
                .Must(useFor => !string.IsNullOrEmpty(useFor)).WithMessage("{PropertyName} is required.");
            });
            
            When(p => p.CateId.HasValue, () => {
            RuleFor(p => p.CateId)
                .Must(id => id > 0).WithMessage("{PropertyName} is required.");
            });
            
            When(p => p.BrandId.HasValue, () => {
            RuleFor(p => p.BrandId)
                .Must(id => id > 0).WithMessage("{PropertyName} is required.");
            });
        }
        
    }
}