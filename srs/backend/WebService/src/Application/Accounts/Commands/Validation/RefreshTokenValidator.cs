using FluentValidation;

namespace Application.Accounts.Commands.Validation
{
    public class RefreshTokenValidator : AbstractValidator<RefreshTokenCommand>
    {
        public RefreshTokenValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required")
                .Must(token => token != null && token.Length >= 32).WithMessage("Invalid refresh token format")
                .Matches(@"^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$")
                .WithMessage("Invalid JWT token format");
        }
    }
}