using Application.DTOs.Category;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface ICategoryService
{
    Task<Result<IEnumerable<CategoryResponse>>> GetAllAsync();
    Task<Result<CategoryResponse>> GetBySlugAsync(string slug);
    Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request);
    Task<Result<CategoryResponse>> UpdateAsync(Guid id, CategoryRequest request);
    Task<Result<bool>> DeleteAsync(Guid id);
}
