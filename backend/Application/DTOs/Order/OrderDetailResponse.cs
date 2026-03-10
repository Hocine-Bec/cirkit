namespace Application.DTOs.Order;
public record OrderDetailResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string CustomerEmail,
    string OrderNumber,
    string Status,
    decimal SubTotal,
    decimal ShippingCost,
    decimal Tax,
    decimal Total,
    string PaymentMethod,
    string? StripePaymentIntentId,
    string ShippingAddressSnapshot,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IEnumerable<OrderItemResponse> Items
);
