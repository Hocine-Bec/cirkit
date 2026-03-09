namespace Application.Interfaces.Repositories;

public interface ICustomerRepository : IGenericRepository<Domain.Entities.Customer>
{
    Task<Domain.Entities.Customer?> GetByEmailAsync(string email);
}
