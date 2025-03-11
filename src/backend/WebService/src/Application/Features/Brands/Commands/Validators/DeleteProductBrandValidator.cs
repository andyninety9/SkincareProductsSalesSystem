using FluentValidation;

namespace Application.Features.Brands.Commands.Validators
{
    public class DeleteProductBrandValidator: AbstractValidator<DeleteProductBrandCommand>
    {
        public DeleteProductBrandValidator()
        {
            RuleFor(x => x.BrandId).NotNull().GreaterThan(0).WithMessage("BrandId must be greater than 0");
        }
    }
}