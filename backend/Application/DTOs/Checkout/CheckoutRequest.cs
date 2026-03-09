namespace Application.DTOs.Checkout;
public record CheckoutRequest(
    IEnumerable<CheckoutItemRequest> Items,
    ShippingAddressRequest ShippingAddress,
    string? Notes
);
