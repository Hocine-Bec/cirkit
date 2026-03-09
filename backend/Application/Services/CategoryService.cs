using Application.DTOs.Category;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;

namespace Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidationService _validation;

    public CategoryService(IUnitOfWork unitOfWork, IValidationService validation)
    {
        _unitOfWork = unitOfWork;
        _validation = validation;
    }

    public async Task<Result<IEnumerable<CategoryResponse>>> GetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return Result<IEnumerable<CategoryResponse>>.Success(categories.Adapt<IEnumerable<CategoryResponse>>());
    }

    public async Task<Result<CategoryResponse>> GetBySlugAsync(string slug)
    {
        var category = await _unitOfWork.Categories.GetBySlugAsync(slug);
        if (category is null)
            return Result<CategoryResponse>.Failure("Category not found", ErrorType.NotFound);

        return Result<CategoryResponse>.Success(category.Adapt<CategoryResponse>());
    }

    public async Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<CategoryResponse>.Failure(validation.Error, validation.ErrorType);

        if (await _unitOfWork.Categories.GetBySlugAsync(request.Slug) is not null)
            return Result<CategoryResponse>.Failure("A category with this slug already exists", ErrorType.Conflict);

        var category = request.Adapt<Category>();
        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return Result<CategoryResponse>.Success(category.Adapt<CategoryResponse>());
    }

    public async Task<Result<CategoryResponse>> UpdateAsync(Guid id, CategoryRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<CategoryResponse>.Failure(validation.Error, validation.ErrorType);

        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category is null)
            return Result<CategoryResponse>.Failure("Category not found", ErrorType.NotFound);

        var existing = await _unitOfWork.Categories.GetBySlugAsync(request.Slug);
        if (existing is not null && existing.Id != id)
            return Result<CategoryResponse>.Failure("A category with this slug already exists", ErrorType.Conflict);

        request.Adapt(category);
        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();

        return Result<CategoryResponse>.Success(category.Adapt<CategoryResponse>());
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category is null)
            return Result<bool>.Failure("Category not found", ErrorType.NotFound);

        if (await _unitOfWork.Products.ExistsAsync(p => p.CategoryId == id))
            return Result<bool>.Failure("Cannot delete a category that has products", ErrorType.Conflict);

        _unitOfWork.Categories.Delete(category);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
