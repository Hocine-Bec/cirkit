namespace Application.DTOs.Checkout;
public record CheckoutResponse(
    Guid OrderId,
    string OrderNumber,
    decimal Total,
    string? ClientSecret,
    string PaymentMethod
);
