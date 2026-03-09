namespace Application.Interfaces.Repositories;

public interface IProductVariantRepository : IGenericRepository<Domain.Entities.ProductVariant>
{
    Task<IEnumerable<Domain.Entities.ProductVariant>> GetByProductIdAsync(Guid productId);
}
