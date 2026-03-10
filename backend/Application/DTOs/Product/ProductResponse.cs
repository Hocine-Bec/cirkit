namespace Application.DTOs.Product;
public record ProductResponse(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
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
    string Specifications,
    double AverageRating,
    int ReviewCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
