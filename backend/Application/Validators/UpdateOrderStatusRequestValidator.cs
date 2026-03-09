using Application.DTOs.Order;
using Domain.Enums;
using FluentValidation;

namespace Application.Validators;

public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s => Enum.TryParse<OrderStatus>(s, out _))
            .WithMessage("Status must be a valid order status (Pending, Processing, Shipped, Delivered, Cancelled, Refunded)");
    }
}
