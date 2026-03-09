using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReviewRepository(AppDbContext context)
    : GenericRepository<Review>(context), IReviewRepository
{
    public async Task<IEnumerable<Review>> GetByProductIdAsync(Guid productId) =>
        await _context.Reviews
            .AsNoTracking()
            .Include(r => r.Customer)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<double> GetAverageRatingAsync(Guid productId)
    {
        var ratings = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Select(r => r.Rating)
            .ToListAsync();

        return ratings.Count == 0 ? 0 : ratings.Average();
    }
}
