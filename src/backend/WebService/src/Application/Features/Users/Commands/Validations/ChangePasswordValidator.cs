using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ChangePasswordValidator: AbstractValidator<ChangePasswordCommand>
    {
        public ChangePasswordValidator()
        {
            RuleFor(x => x.OldPassword).NotEmpty().MinimumLength(6).MaximumLength(20).WithMessage("Password must be between 6 and 20 characters");
            RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6).MaximumLength(20).WithMessage("Password must be between 6 and 20 characters");
            RuleFor(x => x.NewPassword).Equal(x => x.ConfirmPassword).WithMessage("Password and Confirm Password must be the same");
        }
        
    }
}