namespace Application.DTOs.Cart;
public record CartItemRequest(Guid ProductId, Guid? ProductVariantId, int Quantity);
