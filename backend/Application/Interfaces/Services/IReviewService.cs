using Application.DTOs.Review;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IReviewService
{
    Task<Result<IEnumerable<ReviewResponse>>> GetByProductIdAsync(Guid productId);
    Task<Result<ReviewResponse>> CreateAsync(Guid customerId, Guid productId, ReviewRequest request);
    Task<Result<IEnumerable<ReviewResponse>>> GetAllAsync();
    Task<Result<bool>> DeleteAsync(Guid id);
}
