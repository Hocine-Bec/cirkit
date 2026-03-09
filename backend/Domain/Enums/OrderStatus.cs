namespace Domain.Enums;

public enum OrderStatus
{
    Pending,        // Order created, payment pending or mock-confirmed
    Processing,     // Payment confirmed, being prepared
    Shipped,        // In transit
    Delivered,      // Completed
    Cancelled,      // Cancelled by admin or customer
    Refunded        // Payment refunded
}
