using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ApplyVoucherCommandValidator: AbstractValidator<ApplyVoucherCommand>
    {
        public ApplyVoucherCommandValidator()
        {
            RuleFor(x => x.UsrId).NotEmpty();
            RuleFor(x => x.VoucherCode).NotEmpty();
        }
    }
}