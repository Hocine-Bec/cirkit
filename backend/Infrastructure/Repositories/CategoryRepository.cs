using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CategoryRepository(AppDbContext context)
    : GenericRepository<Category>(context), ICategoryRepository
{
    public async Task<Category?> GetBySlugAsync(string slug) =>
        await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug);
}
