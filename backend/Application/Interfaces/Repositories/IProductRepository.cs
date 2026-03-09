namespace Application.Interfaces.Repositories;

public interface IProductRepository : IGenericRepository<Domain.Entities.Product>
{
    Task<Domain.Entities.Product?> GetBySlugAsync(string slug);
    Task<Domain.Entities.Product?> GetBySlugWithDetailsAsync(string slug);
    Task<IEnumerable<Domain.Entities.Product>> GetFeaturedAsync(int count = 8);
    Task<IEnumerable<Domain.Entities.Product>> GetNewArrivalsAsync(int count = 8);
    Task<(IEnumerable<Domain.Entities.Product> Items, int TotalCount)> GetFilteredAsync(
        Guid? categoryId, string? brand, decimal? minPrice, decimal? maxPrice,
        bool? inStock, string? sortBy, int page, int pageSize);
}
