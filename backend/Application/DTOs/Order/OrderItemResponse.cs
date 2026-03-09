namespace Application.DTOs.Order;
public record OrderItemResponse(Guid Id, Guid ProductId, Guid? ProductVariantId, string ProductName, string? VariantName, decimal UnitPrice, int Quantity, decimal Total);
