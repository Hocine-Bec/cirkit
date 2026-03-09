namespace Application.DTOs.Category;
public record CategoryResponse(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    int DisplayOrder,
    bool IsActive,
    int ProductCount
);
