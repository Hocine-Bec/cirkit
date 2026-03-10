namespace Application.DTOs.Review;
public record ReviewResponse(Guid Id, Guid ProductId, Guid CustomerId, string CustomerName, int Rating, string Title, string Comment, bool IsVerifiedPurchase, DateTime CreatedAt);
