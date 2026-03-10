namespace Application.DTOs.Category;
public record CategoryRequest(
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    int DisplayOrder,
    bool IsActive
);
