using System;
using System.Text.RegularExpressions;
using Application.Auth.Commands;
using FluentValidation;

namespace Application.Features.OAuth.Command.Validator
{
    public class GoogleOAuthCommandValidator : AbstractValidator<GoogleOAuthCommand>
    {
        public GoogleOAuthCommandValidator()
        {
            RuleFor(x => x.IdToken)
                .NotEmpty()
                .WithMessage("ID Token is required.")
                .Must(HasNoControlCharacters)
                .WithMessage("Token contains invalid characters.")
                .Must(HasValidJwtFormat)
                .WithMessage("Invalid JWT token format.");
        }

        private bool HasNoControlCharacters(string token)
        {
            return !string.IsNullOrEmpty(token) && !token.Contains("\n") && !token.Contains("\r");
        }

        private bool HasValidJwtFormat(string token)
        {
            return Regex.IsMatch(token, @"^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$");
        }
    }

}
