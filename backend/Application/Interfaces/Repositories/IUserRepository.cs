namespace Application.Interfaces.Repositories;

public interface IUserRepository : IGenericRepository<Domain.Entities.User>
{
    Task<Domain.Entities.User?> GetByEmailAsync(string email);
}
