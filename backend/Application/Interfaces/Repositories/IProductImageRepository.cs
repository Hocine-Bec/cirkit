namespace Application.Interfaces.Repositories;

public interface IProductImageRepository : IGenericRepository<Domain.Entities.ProductImage>
{
    Task<IEnumerable<Domain.Entities.ProductImage>> GetByProductIdAsync(Guid productId);
}
