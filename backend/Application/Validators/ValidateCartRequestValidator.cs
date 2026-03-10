using Application.DTOs.Cart;
using FluentValidation;

namespace Application.Validators;

public class ValidateCartRequestValidator : AbstractValidator<ValidateCartRequest>
{
    public ValidateCartRequestValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("Cart must contain at least one item");
    }
}
