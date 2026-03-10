namespace Application.DTOs.Product;
public record ProductRequest(
    Guid CategoryId,
    string Name,
    string Slug,
    string Description,
    string ShortDescription,
    decimal BasePrice,
    string ImageUrl,
    string Brand,
    string Sku,
    int StockQuantity,
    bool IsActive,
    bool IsFeatured,
    string Specifications
);
