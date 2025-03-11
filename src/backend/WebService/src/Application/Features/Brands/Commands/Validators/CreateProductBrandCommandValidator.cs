using FluentValidation;

namespace Application.Features.Brands.Commands.Validators
{
    public class CreateProductBrandCommandValidator : AbstractValidator<CreateProductBrandCommand>
    {
        public CreateProductBrandCommandValidator()
        {
            RuleFor(x => x.BrandName)
                .NotEmpty().WithMessage("Brand Name is required")
                .NotNull().WithMessage("Brand Name is required");

            RuleFor(x => x.BrandDesc)
                .NotEmpty().WithMessage("Brand Description is required")
                .NotNull().WithMessage("Brand Description is required");

            RuleFor(x => x.BrandOrigin)
                .NotEmpty().WithMessage("Brand Origin is required")
                .NotNull().WithMessage("Brand Origin is required");

            RuleFor(x => x.BrandStatus)
                .NotEmpty().WithMessage("Brand Status is required")
                .NotNull().WithMessage("Brand Status is required")
                .Must(x => x == "true" || x == "false").WithMessage("Brand Status must be true or false");
        }
        
    }
}