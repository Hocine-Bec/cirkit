namespace Domain.Entities;

public class OrderItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;  // Snapshot
    public string? VariantName { get; set; }                  // Snapshot
    public decimal UnitPrice { get; set; }                    // Snapshot
    public int Quantity { get; set; }
    public decimal Total { get; set; }                        // UnitPrice * Quantity

    // Navigation
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public ProductVariant? ProductVariant { get; set; }
}
