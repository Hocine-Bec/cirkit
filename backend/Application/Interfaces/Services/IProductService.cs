using Application.DTOs.Product;
using Application.DTOs.Shared;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IProductService
{
    Task<Result<PaginatedResponse<ProductResponse>>> GetFilteredAsync(Guid? categoryId, string? brand, decimal? minPrice, decimal? maxPrice, bool? inStock, string? sortBy, int page, int pageSize);
    Task<Result<ProductDetailResponse>> GetBySlugAsync(string slug);
    Task<Result<IEnumerable<ProductResponse>>> GetFeaturedAsync();
    Task<Result<IEnumerable<ProductResponse>>> GetNewArrivalsAsync();
    Task<Result<ProductResponse>> CreateAsync(ProductRequest request);
    Task<Result<ProductResponse>> UpdateAsync(Guid id, ProductRequest request);
    Task<Result<bool>> DeleteAsync(Guid id);
    // Images
    Task<Result<ProductImageResponse>> AddImageAsync(Guid productId, ProductImageRequest request);
    Task<Result<ProductImageResponse>> UpdateImageAsync(Guid productId, Guid imageId, ProductImageRequest request);
    Task<Result<bool>> DeleteImageAsync(Guid productId, Guid imageId);
    // Variants
    Task<Result<ProductVariantResponse>> AddVariantAsync(Guid productId, ProductVariantRequest request);
    Task<Result<ProductVariantResponse>> UpdateVariantAsync(Guid productId, Guid variantId, ProductVariantRequest request);
    Task<Result<bool>> DeleteVariantAsync(Guid productId, Guid variantId);
}
