using FluentValidation;

namespace Application.Features.Address.Commands.Validation
{
    public class DeleteAddressCommandValidator : AbstractValidator<DeleteAddressCommand>
    {
        public DeleteAddressCommandValidator()
        {
            RuleFor(x => x.AddressId)
                .NotEmpty().WithMessage("Id is required")
                .NotNull().WithMessage("Id is required")
                .GreaterThan(0).WithMessage("Id is required");
        }
        
    }
}