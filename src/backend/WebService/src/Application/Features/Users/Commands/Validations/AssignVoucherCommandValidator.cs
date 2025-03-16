using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class AssignVoucherCommandValidator : AbstractValidator<AssignVoucherCommand>
    {
        public AssignVoucherCommandValidator()
        {
            RuleFor(x => x.VoucherDesc)
                .NotEmpty().WithMessage("Voucher description is required")
                .MaximumLength(100).WithMessage("Voucher description must not exceed 100 characters");

            RuleFor(x => x.VoucherDiscount)
                .InclusiveBetween(0, 100).WithMessage("Voucher discount must be between 0 and 100");

            RuleFor(x => x.UsrId)
                .NotEmpty().WithMessage("User ID is required")
                .Must(x => long.TryParse(x, out _)).WithMessage("User ID must be a number");
        }
        
    }
}