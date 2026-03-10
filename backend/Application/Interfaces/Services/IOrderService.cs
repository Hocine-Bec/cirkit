using Application.DTOs.Order;
using Application.DTOs.Shared;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IOrderService
{
    Task<Result<PaginatedResponse<OrderResponse>>> GetAllAsync(string? status, DateTime? fromDate, DateTime? toDate, int page, int pageSize);
    Task<Result<OrderDetailResponse>> GetByIdAsync(Guid id);
    Task<Result<OrderDetailResponse>> UpdateStatusAsync(Guid id, string status);
    Task<Result<bool>> ProcessRefundAsync(Guid id);
    // Customer-facing
    Task<Result<IEnumerable<OrderResponse>>> GetCustomerOrdersAsync(Guid customerId);
    Task<Result<OrderDetailResponse>> GetCustomerOrderDetailAsync(Guid customerId, Guid orderId);
}
