using Application.DTOs.Checkout;
using FluentValidation;

namespace Application.Validators;

public class CheckoutRequestValidator : AbstractValidator<CheckoutRequest>
{
    public CheckoutRequestValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("Cart must contain at least one item");
        RuleForEach(x => x.Items).SetValidator(new CheckoutItemRequestValidator());
        RuleFor(x => x.ShippingAddress).NotNull();
        RuleFor(x => x.ShippingAddress.Street).NotEmpty().MaximumLength(300);
        RuleFor(x => x.ShippingAddress.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ShippingAddress.State).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ShippingAddress.ZipCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.ShippingAddress.Country).NotEmpty().MaximumLength(100);
    }
}
