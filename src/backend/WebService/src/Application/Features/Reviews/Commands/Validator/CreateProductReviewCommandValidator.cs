using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Reviews.Commands.Validator
{
    public class CreateProductReviewCommandValidator : AbstractValidator<CreateReviewCommand>
    {
        public CreateProductReviewCommandValidator()
        {
            RuleFor(x => x.ReviewContent)
                .NotEmpty()
                .WithMessage("Review content is required")
                .MaximumLength(500)
                .WithMessage("Review content must not exceed 500 characters");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5");

            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("User id is required");

            RuleFor(x => x.ProdID)
                .NotEmpty()
                .WithMessage("Product id is required");
        }
        
    }
}