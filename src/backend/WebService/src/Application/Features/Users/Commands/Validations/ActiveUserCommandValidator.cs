using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ActiveUserCommandValidator : AbstractValidator<ActiveUserCommand>
    {
        public ActiveUserCommandValidator()
        {
            RuleFor(x => x.UsrId).NotEmpty().WithMessage("User Id is required");
        }
        
    }
}