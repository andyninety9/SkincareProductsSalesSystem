using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ChangePasswordForgotCommandValidator: AbstractValidator<ChangePasswordForgotCommand>
    {
        public ChangePasswordForgotCommandValidator()
        {
            RuleFor(x => x.ForgotPasswordToken).NotEmpty().WithMessage("Forgot password token is required");
            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("New password is required");
            RuleFor(x => x.ConfirmPassword).NotEmpty().WithMessage("Confirm password is required");
            RuleFor(x => x.ConfirmPassword).Equal(x => x.NewPassword).WithMessage("Password and confirm password must be same");
        }
    }
}