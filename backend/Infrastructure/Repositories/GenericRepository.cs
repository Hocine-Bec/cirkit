using System.Linq.Expressions;
using Application.Interfaces.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<T?> GetByIdAsync(Guid id) =>
        await _context.Set<T>().FindAsync(id);

    public virtual async Task<IEnumerable<T>> GetAllAsync() =>
        await _context.Set<T>().AsNoTracking().ToListAsync();

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
        await _context.Set<T>().AsNoTracking().Where(predicate).ToListAsync();

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate) =>
        await _context.Set<T>().AsNoTracking().FirstOrDefaultAsync(predicate);

    public async Task AddAsync(T entity) =>
        await _context.Set<T>().AddAsync(entity);

    public void Update(T entity) =>
        _context.Set<T>().Update(entity);

    public void Delete(T entity) =>
        _context.Set<T>().Remove(entity);

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
        await _context.Set<T>().AnyAsync(predicate);

    public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null) =>
        predicate == null
            ? await _context.Set<T>().CountAsync()
            : await _context.Set<T>().CountAsync(predicate);
}
