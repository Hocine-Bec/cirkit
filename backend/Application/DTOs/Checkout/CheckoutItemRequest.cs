namespace Application.DTOs.Checkout;
public record CheckoutItemRequest(Guid ProductId, Guid? ProductVariantId, int Quantity);
