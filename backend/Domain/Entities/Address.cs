namespace Domain.Entities;

public class Address
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string Label { get; set; } = string.Empty;   // "Home", "Work"
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    // Navigation
    public Customer Customer { get; set; } = null!;
}
