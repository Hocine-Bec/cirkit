using Application.DTOs.Analytics;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IAnalyticsService
{
    Task<Result<OverviewResponse>> GetOverviewAsync();
    Task<Result<IEnumerable<DailyRevenueResponse>>> GetDailyRevenueAsync(int days = 30);
    Task<Result<IEnumerable<OrdersByStatusResponse>>> GetOrdersByStatusAsync();
}
