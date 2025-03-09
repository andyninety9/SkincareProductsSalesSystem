using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Question.Commands.Validator
{
    public class DeleteAnswerCommandValidator: AbstractValidator<DeleteAnswerCommand>
    {
        public DeleteAnswerCommandValidator()
        {
            RuleFor(x => x.keyId).NotEmpty().WithMessage("KeyId is required");
        }
    }
}