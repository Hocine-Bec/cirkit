using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductRepository(AppDbContext context)
    : GenericRepository<Product>(context), IProductRepository
{
    public async Task<Product?> GetBySlugAsync(string slug) =>
        await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<Product?> GetBySlugWithDetailsAsync(string slug) =>
        await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Include(p => p.Variants.Where(v => v.IsActive).OrderBy(v => v.PriceModifier))
            .Include(p => p.Reviews.OrderByDescending(r => r.CreatedAt))
                .ThenInclude(r => r.Customer)
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<IEnumerable<Product>> GetFeaturedAsync(int count = 8) =>
        await _context.Products
            .AsNoTracking()
            .Where(p => p.IsFeatured && p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .OrderBy(p => p.Name)
            .Take(count)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetNewArrivalsAsync(int count = 8) =>
        await _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();

    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetFilteredAsync(
        Guid? categoryId, string? brand, decimal? minPrice, decimal? maxPrice,
        bool? inStock, string? sortBy, int page, int pageSize)
    {
        var query = _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);
        if (!string.IsNullOrEmpty(brand))
            query = query.Where(p => p.Brand == brand);
        if (minPrice.HasValue)
            query = query.Where(p => p.BasePrice >= minPrice.Value);
        if (maxPrice.HasValue)
            query = query.Where(p => p.BasePrice <= maxPrice.Value);
        if (inStock == true)
            query = query.Where(p => p.StockQuantity > 0);

        var totalCount = await query.CountAsync();

        query = sortBy switch
        {
            "price_asc"  => query.OrderBy(p => p.BasePrice),
            "price_desc" => query.OrderByDescending(p => p.BasePrice),
            "newest"     => query.OrderByDescending(p => p.CreatedAt),
            "name"       => query.OrderBy(p => p.Name),
            _            => query.OrderByDescending(p => p.CreatedAt)
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
