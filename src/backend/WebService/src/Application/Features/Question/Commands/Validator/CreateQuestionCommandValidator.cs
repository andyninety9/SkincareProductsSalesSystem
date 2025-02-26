using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Question.Commands.Validator
{
    public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
    {
        public CreateQuestionCommandValidator()
        {
            RuleFor(x => x.CateQuestionId).NotEmpty().WithMessage("CateQuestionId is required");
            RuleFor(x => x.QuestionContent).NotEmpty().WithMessage("QuestionContent is required");
        }
    }
}