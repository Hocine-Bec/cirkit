namespace Application.Interfaces.Repositories;

public interface IOrderRepository : IGenericRepository<Domain.Entities.Order>
{
    Task<Domain.Entities.Order?> GetByIdWithItemsAsync(Guid id);
    Task<Domain.Entities.Order?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Domain.Entities.Order>> GetByCustomerIdAsync(Guid customerId);
    Task<(IEnumerable<Domain.Entities.Order> Items, int TotalCount)> GetFilteredAsync(
        Domain.Enums.OrderStatus? status, DateTime? fromDate, DateTime? toDate,
        int page, int pageSize);
    Task<string> GenerateOrderNumberAsync();
    Task<decimal> GetTotalRevenueAsync(DateTime? from, DateTime? to);
    Task<IEnumerable<(DateTime Date, decimal Revenue)>> GetDailyRevenueAsync(int days = 30);
}
