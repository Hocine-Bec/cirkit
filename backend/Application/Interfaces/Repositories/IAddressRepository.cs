namespace Application.Interfaces.Repositories;

public interface IAddressRepository : IGenericRepository<Domain.Entities.Address>
{
    Task<IEnumerable<Domain.Entities.Address>> GetByCustomerIdAsync(Guid customerId);
}
