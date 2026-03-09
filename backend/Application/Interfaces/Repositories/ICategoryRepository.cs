namespace Application.Interfaces.Repositories;

public interface ICategoryRepository : IGenericRepository<Domain.Entities.Category>
{
    Task<Domain.Entities.Category?> GetBySlugAsync(string slug);
}
