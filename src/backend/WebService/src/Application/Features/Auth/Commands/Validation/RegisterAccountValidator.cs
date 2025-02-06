using FluentValidation;

namespace Application.Auth.Commands.Validation
{
    public class RegisterAccountValidator : AbstractValidator<RegisterAccountCommand>
    {
        public RegisterAccountValidator()
        {
            RuleFor(x => x.Email).NotEmpty().MaximumLength(70).EmailAddress().WithMessage("Email is invalid format");
            RuleFor(x => x.Password).NotEmpty()
                .Length(8, 100)
                .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,100}$")
                .WithMessage("Password must be between 8 and 100 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character");
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Password and Confirm Password must be the same");
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required")
                .Length(6, 50).WithMessage("Username must be between 6 and 50 characters");
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(15).WithMessage("Phone must be less than 15 characters");
        }
    }
}