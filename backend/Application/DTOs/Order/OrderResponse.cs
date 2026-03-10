namespace Application.DTOs.Order;
public record OrderResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string OrderNumber,
    string Status,
    decimal SubTotal,
    decimal ShippingCost,
    decimal Tax,
    decimal Total,
    string PaymentMethod,
    int ItemCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
