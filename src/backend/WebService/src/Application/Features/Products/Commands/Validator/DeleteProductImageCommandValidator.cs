using FluentValidation;

namespace Application.Features.Products.Commands.Validator
{
    public class DeleteProductImageCommandValidator: AbstractValidator<DeleteProductImageUrlCommand>
    {
        public DeleteProductImageCommandValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("ProductId is required");
            RuleFor(x => x.ImageId).NotEmpty().WithMessage("ImageId is required");
        }
    }
}