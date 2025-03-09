using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Question.Commands.Validator
{
    public class UpdateAnswerCommandValidator : AbstractValidator<UpdateAnswerCommand>
    {
        public UpdateAnswerCommandValidator()
        {
            RuleFor(x => x.keyId)
                .NotEmpty().WithMessage("Key ID is required.")
                .Must(id => short.TryParse(id, out _)).WithMessage("Key ID must be a valid number.");

            When(x => x.keyContent != null, () =>
            {
                RuleFor(x => x.keyContent).NotEmpty().WithMessage("Key content cannot be empty if provided.");
            });

            When(x => x.keyScore != null, () =>
            {
                RuleFor(x => x.keyScore)
                    .NotEmpty().WithMessage("Key score cannot be empty if provided.")
                    .Must(score => double.TryParse(score, out double value) && (value == 1 || value == 2 || value == 3 || value == 4 || value == 2.5))
                    .WithMessage("Key score must be 1 (for a), 2 (for b), 3 (for c), 4 (for d), or 2.5.");
            });
        }
        
    }
}