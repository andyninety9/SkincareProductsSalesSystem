using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Question.Commands.Validator
{
    public class CreateAnswerCommandValidator : AbstractValidator<CreateAnswerCommand>
    {
        public CreateAnswerCommandValidator()
        {
            RuleFor(x => x.QuestionId).NotEmpty().WithMessage("Question ID is required.");
            RuleFor(x => x.keyContent).NotEmpty().WithMessage("Key content is required.");
            RuleFor(x => x.keyScore)
                .NotEmpty().WithMessage("Key score is required.")
                .Must(score => double.TryParse(score, out double value) && (value == 1 || value == 2 || value == 3 || value == 4 || value == 2.5))
                .WithMessage("Key score must be 1 (for a), 2 (for b), 3 (for c), 4 (for d).");
        }
        
    }
}