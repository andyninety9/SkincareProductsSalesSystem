using FluentValidation;

namespace Application.Features.Address.Commands.Validation
{
    public class ActiveAddressCommandValidator : AbstractValidator<ActiveAddressCommand>
    {
        public ActiveAddressCommandValidator()
        {
            RuleFor(x => x.AddressId)
                .NotEmpty().WithMessage("Id is required")
                .NotNull().WithMessage("Id is required")
                .GreaterThan(0).WithMessage("Id is required");
        }
        
    }
}