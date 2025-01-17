using FluentValidation;

namespace Application.Accounts.Commands.Validation
{
    public class RegisterAccountValidator : AbstractValidator<RegisterAccountCommand>
    {
        public RegisterAccountValidator()
        {
            RuleFor(x => x.Email).NotEmpty().MaximumLength(70).EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password);
        }
    }
}