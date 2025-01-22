using FluentValidation;

namespace Application.Auth.Commands.Validation
{
    public class RegisterAccountValidator : AbstractValidator<RegisterAccountCommand>
    {
        public RegisterAccountValidator()
        {
            RuleFor(x => x.Email).NotEmpty().MaximumLength(70).EmailAddress().WithMessage("Email is invalid format");
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6).MaximumLength(20).WithMessage("Password must be between 6 and 20 characters");
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Password and Confirm Password must be the same");
            RuleFor(x => x.Username).NotEmpty().MaximumLength(50).WithMessage("Username must be less than 50 characters");
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(15).WithMessage("Phone must be less than 15 characters");
        }
    }
}