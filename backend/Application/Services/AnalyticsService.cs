using Application.DTOs.Analytics;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Enums;

namespace Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUnitOfWork _unitOfWork;

    public AnalyticsService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<OverviewResponse>> GetOverviewAsync()
    {
        var totalRevenue = await _unitOfWork.Orders.GetTotalRevenueAsync(null, null);

        var today = DateTime.UtcNow.Date;
        var todayRevenue = await _unitOfWork.Orders.GetTotalRevenueAsync(today, today.AddDays(1).AddTicks(-1));

        var allOrders = await _unitOfWork.Orders.GetAllAsync();
        var orderList = allOrders.ToList();

        var totalOrders = orderList.Count;
        var pendingOrders = orderList.Count(o => o.Status == OrderStatus.Pending);
        var completedOrders = orderList
            .Where(o => o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Refunded)
            .ToList();
        var averageOrderValue = completedOrders.Count > 0
            ? completedOrders.Average(o => o.Total)
            : 0;

        var totalCustomers = await _unitOfWork.Customers.CountAsync(_ => true);

        return Result<OverviewResponse>.Success(new OverviewResponse(
            totalRevenue,
            todayRevenue,
            totalOrders,
            totalCustomers,
            averageOrderValue,
            pendingOrders
        ));
    }

    public async Task<Result<IEnumerable<DailyRevenueResponse>>> GetDailyRevenueAsync(int days = 30)
    {
        var data = await _unitOfWork.Orders.GetDailyRevenueAsync(days);
        var result = data.Select(d => new DailyRevenueResponse(d.Date, d.Revenue));
        return Result<IEnumerable<DailyRevenueResponse>>.Success(result);
    }

    public async Task<Result<IEnumerable<OrdersByStatusResponse>>> GetOrdersByStatusAsync()
    {
        var orders = await _unitOfWork.Orders.GetAllAsync();
        var grouped = orders
            .GroupBy(o => o.Status.ToString())
            .Select(g => new OrdersByStatusResponse(g.Key, g.Count()));

        return Result<IEnumerable<OrdersByStatusResponse>>.Success(grouped);
    }
}
