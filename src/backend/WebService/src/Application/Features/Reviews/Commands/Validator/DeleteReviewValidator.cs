
using Application.Features.Reviews.Commands.Response;
using FluentValidation;

namespace Application.Features.Reviews.Commands.Validator
{
    public class DeleteReviewValidator : AbstractValidator<DeleteReviewCommand>
    {
        public DeleteReviewValidator()
        {
            RuleFor(x => x.ReviewId).NotEmpty().WithMessage("Review ID is required.");
        }

    }
}