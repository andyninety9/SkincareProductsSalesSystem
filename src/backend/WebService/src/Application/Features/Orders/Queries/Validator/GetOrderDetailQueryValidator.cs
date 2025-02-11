using Application.Orders.Queries;
using FluentValidation;

namespace Application.Features.Orders.Queries.Validator
{
    public class GetOrderDetailQueryValidator : AbstractValidator<GetOrderDetailQuery>
    {
        public GetOrderDetailQueryValidator()
        {
            RuleFor(x => x.OrderId)
                .NotEmpty().WithMessage("OrderId is required")
                .GreaterThan(0).WithMessage("OrderId must be long number greater than 0");
        }
        
    }
}