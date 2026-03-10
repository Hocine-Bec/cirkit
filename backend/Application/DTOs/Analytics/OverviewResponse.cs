namespace Application.DTOs.Analytics;
public record OverviewResponse(decimal TotalRevenue, decimal TodayRevenue, int TotalOrders, int TotalCustomers, decimal AverageOrderValue, int PendingOrders);
