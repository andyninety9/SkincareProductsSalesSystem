using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.RecommendForFeature.Commands.Validators
{
    public class DeleteRecommendForCommandValidator : AbstractValidator<DeleteRecommendForCommand>
    {
        public DeleteRecommendForCommandValidator()
        {
            RuleFor(x => x.RecForId)
                .NotEmpty().WithMessage("Recommend For Id is required")
                .NotNull().WithMessage("Recommend For Id is required");
        }
        
    }
}