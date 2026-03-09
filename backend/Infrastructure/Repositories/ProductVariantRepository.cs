using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductVariantRepository(AppDbContext context)
    : GenericRepository<ProductVariant>(context), IProductVariantRepository
{
    public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId) =>
        await _context.ProductVariants
            .AsNoTracking()
            .Where(v => v.ProductId == productId && v.IsActive)
            .OrderBy(v => v.PriceModifier)
            .ToListAsync();
}
