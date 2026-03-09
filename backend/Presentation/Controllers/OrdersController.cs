using Application.DTOs.Order;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    public OrdersController(IOrderService orderService) => _orderService = orderService;

    // Customer endpoints

    [Authorize(Roles = "Customer")]
    [HttpGet("orders/my")]
    public async Task<IActionResult> GetMyOrders()
        => (await _orderService.GetCustomerOrdersAsync(User.GetUserId())).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpGet("orders/my/{id:guid}")]
    public async Task<IActionResult> GetMyOrderDetail(Guid id)
        => (await _orderService.GetCustomerOrderDetailAsync(User.GetUserId(), id)).HandleResult();

    // Admin endpoints

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("admin/orders")]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => (await _orderService.GetAllAsync(status, fromDate, toDate, page, pageSize)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("admin/orders/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => (await _orderService.GetByIdAsync(id)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpPatch("admin/orders/{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
        => (await _orderService.UpdateStatusAsync(id, request.Status)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("admin/orders/{id:guid}/refund")]
    public async Task<IActionResult> Refund(Guid id)
        => (await _orderService.ProcessRefundAsync(id)).HandleResult();
}
