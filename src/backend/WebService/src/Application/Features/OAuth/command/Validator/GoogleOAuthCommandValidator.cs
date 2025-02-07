using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Auth.Commands;
using FluentValidation;

namespace Application.Features.OAuth.command.Validator
{
    public class GoogleOAuthCommandValidator : AbstractValidator<GoogleOAuthCommand>
    {
        public GoogleOAuthCommandValidator()
        {
            RuleFor(x => x.idToken)
                .NotEmpty()
                .WithMessage("ID Token is required.")
                .Must(token => token.Split('.').Length == 3)
                .WithMessage("Invalid JWT token format");
        }
        
    }
}