using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Address.Commands.Validation
{
    public class CreateAddressCommandValidator: AbstractValidator<CreateAddressCommand>
    {
        public CreateAddressCommandValidator()
        {
            RuleFor(x => x.UsrId).NotEmpty();
            RuleFor(x => x.AddDetail).NotEmpty();
            RuleFor(x => x.Ward).NotEmpty();
            RuleFor(x => x.District).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
        }
    }
}