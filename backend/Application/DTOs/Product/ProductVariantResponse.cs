namespace Application.DTOs.Product;
public record ProductVariantResponse(Guid Id, Guid ProductId, string Name, string Sku, decimal PriceModifier, int StockQuantity, bool IsActive);
