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
                .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,100}$")
                .WithMessage("Password must be between 8 and 100 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}