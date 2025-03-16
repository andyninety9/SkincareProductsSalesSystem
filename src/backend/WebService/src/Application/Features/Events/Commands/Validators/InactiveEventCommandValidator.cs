using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Events.Commands.Validators
{
    public class InactiveEventCommandValidator: AbstractValidator<InactiveEventCommand>
    {
        public InactiveEventCommandValidator()
        {
            RuleFor(x => x.EventId).NotEmpty().WithMessage("EventId is required");
        }
    }
}