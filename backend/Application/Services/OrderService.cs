using Application.DTOs.Order;
using Application.DTOs.Shared;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Enums;
using Mapster;

namespace Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPaymentService _paymentService;

    public OrderService(IUnitOfWork unitOfWork, IPaymentService paymentService)
    {
        _unitOfWork = unitOfWork;
        _paymentService = paymentService;
    }

    public async Task<Result<PaginatedResponse<OrderResponse>>> GetAllAsync(
        string? status, DateTime? fromDate, DateTime? toDate, int page, int pageSize)
    {
        OrderStatus? parsedStatus = null;
        if (status is not null && Enum.TryParse<OrderStatus>(status, out var s))
            parsedStatus = s;

        var (items, totalCount) = await _unitOfWork.Orders.GetFilteredAsync(parsedStatus, fromDate, toDate, page, pageSize);
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var mapped = items.Adapt<IEnumerable<OrderResponse>>();

        return Result<PaginatedResponse<OrderResponse>>.Success(
            new PaginatedResponse<OrderResponse>(mapped, totalCount, page, pageSize, totalPages));
    }

    public async Task<Result<OrderDetailResponse>> GetByIdAsync(Guid id)
    {
        var order = await _unitOfWork.Orders.GetByIdWithItemsAsync(id);
        if (order is null)
            return Result<OrderDetailResponse>.Failure("Order not found", ErrorType.NotFound);

        return Result<OrderDetailResponse>.Success(order.Adapt<OrderDetailResponse>());
    }

    public async Task<Result<OrderDetailResponse>> UpdateStatusAsync(Guid id, string status)
    {
        if (!Enum.TryParse<OrderStatus>(status, out var newStatus))
            return Result<OrderDetailResponse>.Failure("Invalid order status", ErrorType.BadRequest);

        var order = await _unitOfWork.Orders.GetByIdWithItemsAsync(id);
        if (order is null)
            return Result<OrderDetailResponse>.Failure("Order not found", ErrorType.NotFound);

        if (!IsValidTransition(order.Status, newStatus))
            return Result<OrderDetailResponse>.Failure(
                $"Cannot transition from {order.Status} to {newStatus}", ErrorType.BadRequest);

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync();

        return Result<OrderDetailResponse>.Success(order.Adapt<OrderDetailResponse>());
    }

    public async Task<Result<bool>> ProcessRefundAsync(Guid id)
    {
        var order = await _unitOfWork.Orders.GetByIdWithItemsAsync(id);
        if (order is null)
            return Result<bool>.Failure("Order not found", ErrorType.NotFound);

        if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.Refunded)
            return Result<bool>.Failure("Order is already cancelled or refunded", ErrorType.BadRequest);

        var refundSuccess = await _paymentService.ProcessRefundAsync(order.StripePaymentIntentId ?? string.Empty);
        if (!refundSuccess)
            return Result<bool>.Failure("Refund processing failed", ErrorType.InternalServerError);

        order.Status = OrderStatus.Refunded;
        order.UpdatedAt = DateTime.UtcNow;

        foreach (var item in order.Items)
        {
            if (item.ProductVariantId.HasValue)
            {
                var variant = await _unitOfWork.ProductVariants.GetByIdAsync(item.ProductVariantId.Value);
                if (variant is not null)
                {
                    variant.StockQuantity += item.Quantity;
                    _unitOfWork.ProductVariants.Update(variant);
                }
            }
            else
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                if (product is not null)
                {
                    product.StockQuantity += item.Quantity;
                    _unitOfWork.Products.Update(product);
                }
            }
        }

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<IEnumerable<OrderResponse>>> GetCustomerOrdersAsync(Guid customerId)
    {
        var orders = await _unitOfWork.Orders.GetByCustomerIdAsync(customerId);
        return Result<IEnumerable<OrderResponse>>.Success(orders.Adapt<IEnumerable<OrderResponse>>());
    }

    public async Task<Result<OrderDetailResponse>> GetCustomerOrderDetailAsync(Guid customerId, Guid orderId)
    {
        var order = await _unitOfWork.Orders.GetByIdWithItemsAsync(orderId);
        if (order is null || order.CustomerId != customerId)
            return Result<OrderDetailResponse>.Failure("Order not found", ErrorType.NotFound);

        return Result<OrderDetailResponse>.Success(order.Adapt<OrderDetailResponse>());
    }

    private static bool IsValidTransition(OrderStatus current, OrderStatus next)
    {
        if (next == OrderStatus.Cancelled) return current is OrderStatus.Pending or OrderStatus.Processing;
        if (next == OrderStatus.Refunded) return current is OrderStatus.Processing or OrderStatus.Shipped or OrderStatus.Delivered;

        return (current, next) switch
        {
            (OrderStatus.Pending,    OrderStatus.Processing) => true,
            (OrderStatus.Processing, OrderStatus.Shipped)    => true,
            (OrderStatus.Shipped,    OrderStatus.Delivered)  => true,
            _ => false
        };
    }
}
