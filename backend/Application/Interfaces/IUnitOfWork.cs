using Application.Interfaces.Repositories;

namespace Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICategoryRepository Categories { get; }
    IProductRepository Products { get; }
    IProductImageRepository ProductImages { get; }
    IProductVariantRepository ProductVariants { get; }
    ICustomerRepository Customers { get; }
    IAddressRepository Addresses { get; }
    IOrderRepository Orders { get; }
    IGenericRepository<Domain.Entities.OrderItem> OrderItems { get; }
    IUserRepository Users { get; }
    IReviewRepository Reviews { get; }

    Task<int> SaveChangesAsync();
}
