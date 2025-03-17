using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class UseVoucherCommandValidator:AbstractValidator<UseVoucherCommand>
    {
        public UseVoucherCommandValidator()
        {
            RuleFor(x => x.OrderId).NotEmpty().WithMessage("OrderId is required");
            RuleFor(x => x.VoucherCode).NotEmpty().WithMessage("VoucherCode is required");
        }
    }
}