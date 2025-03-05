using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.ProductCategory.Commands;
using FluentValidation;

namespace Application.Features.Orders.Commands.Validator
{
    public class CancelOrderCommandValidator : AbstractValidator<CancelOrderCommand>
    {
        public CancelOrderCommandValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("UserId must be a positive number");

            RuleFor(x => x.OrderId)
                .GreaterThan(0).WithMessage("OrderId must be greater than zero.");
            RuleFor(x => x.Note)
                .MaximumLength(500)
                .WithMessage("Note must be less than 500 characters");
        }
        
        
    }
}