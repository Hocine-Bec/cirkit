using Application.DTOs.Checkout;
using FluentValidation;

namespace Application.Validators;

public class CheckoutItemRequestValidator : AbstractValidator<CheckoutItemRequest>
{
    public CheckoutItemRequestValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}
