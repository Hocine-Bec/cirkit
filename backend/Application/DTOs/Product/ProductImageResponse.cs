namespace Application.DTOs.Product;
public record ProductImageResponse(Guid Id, Guid ProductId, string ImageUrl, int DisplayOrder, bool IsMain);
