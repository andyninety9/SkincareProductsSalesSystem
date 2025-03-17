using FluentValidation;

namespace Application.Features.RecommendForFeature.Commands.Validators
{
    public class CreateRecommendForCommandValidator : AbstractValidator<CreateRecommendForCommand>
    {
        public CreateRecommendForCommandValidator()
        {
            RuleFor(x => x.ProdId)
                .NotEmpty().WithMessage("Product Id is required")
                .NotNull().WithMessage("Product Id is required");

            RuleFor(x => x.SkinTypeId)
                .NotEmpty().WithMessage("Skin Type Id is required")
                .NotNull().WithMessage("Skin Type Id is required");
        }
    }
}