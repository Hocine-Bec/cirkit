using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductImageRepository(AppDbContext context)
    : GenericRepository<ProductImage>(context), IProductImageRepository
{
    public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId) =>
        await _context.ProductImages
            .AsNoTracking()
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync();
}
