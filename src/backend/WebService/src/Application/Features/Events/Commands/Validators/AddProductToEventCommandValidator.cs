using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Events.Commands.Validators
{
    public class AddProductToEventCommandValidator : AbstractValidator<AddProductToEventCommand>
    {
        public AddProductToEventCommandValidator()
        {
            RuleFor(x => x.EventId)
                .NotEmpty().WithMessage("Event Id is required.");
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product Id is required.");
        }
    }
}