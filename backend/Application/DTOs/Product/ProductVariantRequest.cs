namespace Application.DTOs.Product;
public record ProductVariantRequest(string Name, string Sku, decimal PriceModifier, int StockQuantity, bool IsActive);
