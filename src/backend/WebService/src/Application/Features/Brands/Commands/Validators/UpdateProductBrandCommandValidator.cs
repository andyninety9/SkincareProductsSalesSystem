
using FluentValidation;

namespace Application.Features.Brands.Commands.Validators
{
    public class UpdateProductBrandCommandValidator : AbstractValidator<UpdateProductBrandCommand>
    {
        public UpdateProductBrandCommandValidator()
        {
            RuleFor(x => x.BrandId).GreaterThan(0).WithMessage("BrandId must be greater than 0");
            
            When(x => !string.IsNullOrEmpty(x.BrandName), () => {
                RuleFor(x => x.BrandName).NotEmpty().WithMessage("BrandName is required");
            });
            
            When(x => !string.IsNullOrEmpty(x.BrandDesc), () => {
                RuleFor(x => x.BrandDesc).NotEmpty().WithMessage("BrandDesc is required");
            });
            
            When(x => !string.IsNullOrEmpty(x.BrandOrigin), () => {
                RuleFor(x => x.BrandOrigin).NotEmpty().WithMessage("BrandOrigin is required");
            });
            
            When(x => x.BrandStatus != null, () => {
                RuleFor(x => x.BrandStatus)
                    .NotNull().WithMessage("BrandStatus is required")
                    .Must(status => bool.TryParse(status.ToString(), out bool result) && (result == false || result == true))
                    .WithMessage("BrandStatus must be either false or true");
            });
        }
        
    }
}