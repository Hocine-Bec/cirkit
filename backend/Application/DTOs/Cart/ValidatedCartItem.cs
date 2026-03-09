namespace Application.DTOs.Cart;
public record ValidatedCartItem(
    Guid ProductId,
    Guid? ProductVariantId,
    string ProductName,
    string? VariantName,
    decimal UnitPrice,
    int Quantity,
    int AvailableStock,
    bool IsAvailable,
    string ImageUrl
);
