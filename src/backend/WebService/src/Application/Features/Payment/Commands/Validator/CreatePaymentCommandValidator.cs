using FluentValidation;

namespace Application.Features.Payment.Commands.Validator
{
    public class CreatePaymentCommandValidator : AbstractValidator<CreatePaymentCommand>
    {
        public CreatePaymentCommandValidator()
        {
            RuleFor(x => x.OrderId)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull()
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than 0.");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50).WithMessage("{PropertyName} must not exceed 50 characters.")
                .Must(x => x.ToUpper() == "VNPAY").WithMessage("{PropertyName} must be VNPAY.");

            RuleFor(x => x.PaymentAmount)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull()
                .GreaterThan(0).WithMessage("{PropertyName} must be greater than 0.")
                .Must(x => x >= 1000 && x <= 1000000000).WithMessage("{PropertyName} must be between 1,000 VND and 1,000,000,000 VND.");

        }
    }
}