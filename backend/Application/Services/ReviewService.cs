using Application.DTOs.Review;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;

namespace Application.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidationService _validation;

    public ReviewService(IUnitOfWork unitOfWork, IValidationService validation)
    {
        _unitOfWork = unitOfWork;
        _validation = validation;
    }

    public async Task<Result<IEnumerable<ReviewResponse>>> GetByProductIdAsync(Guid productId)
    {
        var reviews = await _unitOfWork.Reviews.GetByProductIdAsync(productId);
        return Result<IEnumerable<ReviewResponse>>.Success(reviews.Adapt<IEnumerable<ReviewResponse>>());
    }

    public async Task<Result<IEnumerable<ReviewResponse>>> GetAllAsync()
    {
        var reviews = await _unitOfWork.Reviews.GetAllAsync();
        return Result<IEnumerable<ReviewResponse>>.Success(reviews.Adapt<IEnumerable<ReviewResponse>>());
    }

    public async Task<Result<ReviewResponse>> CreateAsync(Guid customerId, Guid productId, ReviewRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ReviewResponse>.Failure(validation.Error, validation.ErrorType);

        if (!await _unitOfWork.Products.ExistsAsync(p => p.Id == productId && p.IsActive))
            return Result<ReviewResponse>.Failure("Product not found", ErrorType.NotFound);

        if (await _unitOfWork.Reviews.ExistsAsync(r => r.CustomerId == customerId && r.ProductId == productId))
            return Result<ReviewResponse>.Failure("You have already reviewed this product", ErrorType.Conflict);

        var hasVerifiedPurchase = await _unitOfWork.Orders.ExistsAsync(o =>
            o.CustomerId == customerId &&
            o.Items.Any(i => i.ProductId == productId) &&
            o.Status == Domain.Enums.OrderStatus.Delivered);

        var review = new Review
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            ProductId = productId,
            Rating = request.Rating,
            Title = request.Title,
            Comment = request.Comment,
            IsVerifiedPurchase = hasVerifiedPurchase,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Reviews.AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _unitOfWork.Reviews.GetByIdAsync(review.Id);
        return Result<ReviewResponse>.Success(saved!.Adapt<ReviewResponse>());
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null)
            return Result<bool>.Failure("Review not found", ErrorType.NotFound);

        _unitOfWork.Reviews.Delete(review);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
