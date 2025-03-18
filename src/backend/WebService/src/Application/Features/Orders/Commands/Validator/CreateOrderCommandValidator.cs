using FluentValidation;

namespace Application.Features.Orders.Commands.Validator
{
    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            // Validate UserId (bắt buộc, phải là số nguyên dương)
            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage("UserId must be a positive number");

            // Validate EventId (nếu có thì phải lớn hơn 0)
            RuleFor(x => x.EventId)
                .GreaterThan(0)
                .When(x => x.EventId.HasValue)
                .WithMessage("EventId must be a positive number if provided");


            // Validate VoucherCodeApplied (nếu có thì không được rỗng)

            RuleFor(x => x.VoucherCodeApplied)
                .NotEmpty()
                .When(x => !string.IsNullOrWhiteSpace(x.VoucherCodeApplied))
                .WithMessage("VoucherCodeApplied must not be empty if provided");

            // Validate OrderItems (không được rỗng)
            RuleFor(x => x.OrderItems)
                .NotEmpty()
                .WithMessage("Order must contain at least one product");

            // Validate từng OrderItem
            RuleForEach(x => x.OrderItems).ChildRules(orderItem =>
            {
                // ProductId phải là số nguyên dương
                orderItem.RuleFor(x => x.ProductId)
                    .GreaterThan(0)
                    .WithMessage("ProductId must be a positive number");

                // Quantity phải lớn hơn 0
                orderItem.RuleFor(x => (int)x.Quantity)
                    .GreaterThan(0)
                    .WithMessage("Quantity must be greater than zero");

                // SellPrice phải lớn hơn 0
                orderItem.RuleFor(x => x.SellPrice)
                    .GreaterThan(0)
                    .WithMessage("SellPrice must be greater than zero");
            });
        }
    }
}
