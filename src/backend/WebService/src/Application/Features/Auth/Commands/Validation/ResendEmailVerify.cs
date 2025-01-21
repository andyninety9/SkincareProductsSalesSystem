using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Auth.Commands;
using FluentValidation;

namespace Application.Features.Auth.Commands.Validation
{
    public class ResendEmailVerify : AbstractValidator<ResendEmailVerifyCommand>
    {
        public ResendEmailVerify()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");
        }
    }
}