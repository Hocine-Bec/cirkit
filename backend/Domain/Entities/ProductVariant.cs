namespace Domain.Entities;

public class ProductVariant
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Name { get; set; } = string.Empty;    // "256GB Space Black"
    public string Sku { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; }           // Added to Product.BasePrice
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation
    public Product Product { get; set; } = null!;
}
