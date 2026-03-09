using Application.Interfaces.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OrderRepository(AppDbContext context)
    : GenericRepository<Order>(context), IOrderRepository
{
    public async Task<Order?> GetByIdWithItemsAsync(Guid id) =>
        await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber) =>
        await _context.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId) =>
        await _context.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<(IEnumerable<Order> Items, int TotalCount)> GetFilteredAsync(
        OrderStatus? status, DateTime? fromDate, DateTime? toDate,
        int page, int pageSize)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);
        if (fromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(o => o.CreatedAt <= toDate.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<string> GenerateOrderNumberAsync()
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var todayCount = await _context.Orders
            .CountAsync(o => o.CreatedAt.Date == DateTime.UtcNow.Date);
        return $"CK-{today}-{(todayCount + 1):D4}";
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime? from, DateTime? to)
    {
        var query = _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Refunded);

        if (from.HasValue)
            query = query.Where(o => o.CreatedAt >= from.Value);
        if (to.HasValue)
            query = query.Where(o => o.CreatedAt <= to.Value);

        return await query.SumAsync(o => o.Total);
    }

    public async Task<IEnumerable<(DateTime Date, decimal Revenue)>> GetDailyRevenueAsync(int days = 30)
    {
        var since = DateTime.UtcNow.AddDays(-days).Date;

        var data = await _context.Orders
            .Where(o => o.CreatedAt >= since
                     && o.Status != OrderStatus.Cancelled
                     && o.Status != OrderStatus.Refunded)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Revenue = g.Sum(o => o.Total) })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return data.Select(x => (x.Date, x.Revenue));
    }
}
