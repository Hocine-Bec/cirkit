namespace Application.DTOs.Cart;
public record ValidateCartRequest(IEnumerable<CartItemRequest> Items);
