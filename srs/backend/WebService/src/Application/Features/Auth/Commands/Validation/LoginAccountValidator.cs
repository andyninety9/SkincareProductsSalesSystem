using FluentValidation;

namespace Application.Auth.Commands.Validation
{
    public class LoginAccountValidator : AbstractValidator<LoginAccountCommand>
    {
        public LoginAccountValidator()
        {
            RuleFor(x => x.Username).NotEmpty().Length(6, 50).WithMessage("Username must be between 6 and 50 characters")
            .WithMessage("Username is required");
            RuleFor(x => x.Password)
                .NotEmpty()
                .Length(8, 100)
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one number")
                .Matches(@"[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character")
                .WithMessage("Password must be between 8 and 100 characters");
        }
    }
}