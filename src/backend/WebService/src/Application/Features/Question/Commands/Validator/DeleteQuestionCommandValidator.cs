using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Question.Commands.Validator
{
    public class DeleteQuestionCommandValidator : AbstractValidator<DeleteQuestionCommand>
    {
        public DeleteQuestionCommandValidator()
        {
            RuleFor(x => x.QuestionId).NotEmpty().WithMessage("QuestionId is required");
        }
        
    }
}