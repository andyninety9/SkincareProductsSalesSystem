using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Events.Commands.Validators
{
    public class ActiveEventCommandValidator : AbstractValidator<ActiveEventCommand>
    {
        public ActiveEventCommandValidator()
        {
            RuleFor(x => x.EventId)
                .NotEmpty().WithMessage("EventId is required")
                .NotNull().WithMessage("EventId is required");
        }
        
    }
}