using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Return.Commands.validators
{
    public class ProcessReturnCommandValidator : AbstractValidator<ProcessReturnCommand>
    {
        public ProcessReturnCommandValidator()
        {
            RuleFor(x => x.ReturnId).NotEmpty().WithMessage("Return ID is required");
            RuleFor(x => x.Status).NotNull().WithMessage("Status is required")
                .Must(status => status == true || status == false).WithMessage("Status must be either true or false");
        }
        
    }
}