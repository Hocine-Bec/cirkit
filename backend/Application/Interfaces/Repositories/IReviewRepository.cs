namespace Application.Interfaces.Repositories;

public interface IReviewRepository : IGenericRepository<Domain.Entities.Review>
{
    Task<IEnumerable<Domain.Entities.Review>> GetByProductIdAsync(Guid productId);
    Task<double> GetAverageRatingAsync(Guid productId);
}
