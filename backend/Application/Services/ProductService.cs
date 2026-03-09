using Application.DTOs.Product;
using Application.DTOs.Shared;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;

namespace Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidationService _validation;

    public ProductService(IUnitOfWork unitOfWork, IValidationService validation)
    {
        _unitOfWork = unitOfWork;
        _validation = validation;
    }

    public async Task<Result<PaginatedResponse<ProductResponse>>> GetFilteredAsync(
        Guid? categoryId, string? brand, decimal? minPrice, decimal? maxPrice,
        bool? inStock, string? sortBy, int page, int pageSize)
    {
        var (items, totalCount) = await _unitOfWork.Products.GetFilteredAsync(
            categoryId, brand, minPrice, maxPrice, inStock, sortBy, page, pageSize);

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var mapped = items.Adapt<IEnumerable<ProductResponse>>();

        return Result<PaginatedResponse<ProductResponse>>.Success(
            new PaginatedResponse<ProductResponse>(mapped, totalCount, page, pageSize, totalPages));
    }

    public async Task<Result<ProductDetailResponse>> GetBySlugAsync(string slug)
    {
        var product = await _unitOfWork.Products.GetBySlugWithDetailsAsync(slug);
        if (product is null)
            return Result<ProductDetailResponse>.Failure("Product not found", ErrorType.NotFound);

        return Result<ProductDetailResponse>.Success(product.Adapt<ProductDetailResponse>());
    }

    public async Task<Result<IEnumerable<ProductResponse>>> GetFeaturedAsync()
    {
        var products = await _unitOfWork.Products.GetFeaturedAsync();
        return Result<IEnumerable<ProductResponse>>.Success(products.Adapt<IEnumerable<ProductResponse>>());
    }

    public async Task<Result<IEnumerable<ProductResponse>>> GetNewArrivalsAsync()
    {
        var products = await _unitOfWork.Products.GetNewArrivalsAsync();
        return Result<IEnumerable<ProductResponse>>.Success(products.Adapt<IEnumerable<ProductResponse>>());
    }

    public async Task<Result<ProductResponse>> CreateAsync(ProductRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductResponse>.Failure(validation.Error, validation.ErrorType);

        if (await _unitOfWork.Products.GetBySlugAsync(request.Slug) is not null)
            return Result<ProductResponse>.Failure("A product with this slug already exists", ErrorType.Conflict);

        if (await _unitOfWork.Products.ExistsAsync(p => p.Sku == request.Sku))
            return Result<ProductResponse>.Failure("A product with this SKU already exists", ErrorType.Conflict);

        if (!await _unitOfWork.Categories.ExistsAsync(c => c.Id == request.CategoryId))
            return Result<ProductResponse>.Failure("Category not found", ErrorType.NotFound);

        var product = request.Adapt<Product>();
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductResponse>.Success(product.Adapt<ProductResponse>());
    }

    public async Task<Result<ProductResponse>> UpdateAsync(Guid id, ProductRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductResponse>.Failure(validation.Error, validation.ErrorType);

        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product is null)
            return Result<ProductResponse>.Failure("Product not found", ErrorType.NotFound);

        var slugConflict = await _unitOfWork.Products.GetBySlugAsync(request.Slug);
        if (slugConflict is not null && slugConflict.Id != id)
            return Result<ProductResponse>.Failure("A product with this slug already exists", ErrorType.Conflict);

        if (await _unitOfWork.Products.ExistsAsync(p => p.Sku == request.Sku && p.Id != id))
            return Result<ProductResponse>.Failure("A product with this SKU already exists", ErrorType.Conflict);

        if (!await _unitOfWork.Categories.ExistsAsync(c => c.Id == request.CategoryId))
            return Result<ProductResponse>.Failure("Category not found", ErrorType.NotFound);

        request.Adapt(product);
        product.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductResponse>.Success(product.Adapt<ProductResponse>());
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product is null)
            return Result<bool>.Failure("Product not found", ErrorType.NotFound);

        _unitOfWork.Products.Delete(product);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    // Images

    public async Task<Result<ProductImageResponse>> AddImageAsync(Guid productId, ProductImageRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductImageResponse>.Failure(validation.Error, validation.ErrorType);

        if (!await _unitOfWork.Products.ExistsAsync(p => p.Id == productId))
            return Result<ProductImageResponse>.Failure("Product not found", ErrorType.NotFound);

        var image = request.Adapt<ProductImage>();
        image.ProductId = productId;

        await _unitOfWork.ProductImages.AddAsync(image);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductImageResponse>.Success(image.Adapt<ProductImageResponse>());
    }

    public async Task<Result<ProductImageResponse>> UpdateImageAsync(Guid productId, Guid imageId, ProductImageRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductImageResponse>.Failure(validation.Error, validation.ErrorType);

        var image = await _unitOfWork.ProductImages.GetByIdAsync(imageId);
        if (image is null || image.ProductId != productId)
            return Result<ProductImageResponse>.Failure("Image not found", ErrorType.NotFound);

        request.Adapt(image);
        _unitOfWork.ProductImages.Update(image);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductImageResponse>.Success(image.Adapt<ProductImageResponse>());
    }

    public async Task<Result<bool>> DeleteImageAsync(Guid productId, Guid imageId)
    {
        var image = await _unitOfWork.ProductImages.GetByIdAsync(imageId);
        if (image is null || image.ProductId != productId)
            return Result<bool>.Failure("Image not found", ErrorType.NotFound);

        _unitOfWork.ProductImages.Delete(image);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    // Variants

    public async Task<Result<ProductVariantResponse>> AddVariantAsync(Guid productId, ProductVariantRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductVariantResponse>.Failure(validation.Error, validation.ErrorType);

        if (!await _unitOfWork.Products.ExistsAsync(p => p.Id == productId))
            return Result<ProductVariantResponse>.Failure("Product not found", ErrorType.NotFound);

        if (await _unitOfWork.ProductVariants.ExistsAsync(v => v.Sku == request.Sku))
            return Result<ProductVariantResponse>.Failure("A variant with this SKU already exists", ErrorType.Conflict);

        var variant = request.Adapt<ProductVariant>();
        variant.ProductId = productId;

        await _unitOfWork.ProductVariants.AddAsync(variant);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductVariantResponse>.Success(variant.Adapt<ProductVariantResponse>());
    }

    public async Task<Result<ProductVariantResponse>> UpdateVariantAsync(Guid productId, Guid variantId, ProductVariantRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<ProductVariantResponse>.Failure(validation.Error, validation.ErrorType);

        var variant = await _unitOfWork.ProductVariants.GetByIdAsync(variantId);
        if (variant is null || variant.ProductId != productId)
            return Result<ProductVariantResponse>.Failure("Variant not found", ErrorType.NotFound);

        if (await _unitOfWork.ProductVariants.ExistsAsync(v => v.Sku == request.Sku && v.Id != variantId))
            return Result<ProductVariantResponse>.Failure("A variant with this SKU already exists", ErrorType.Conflict);

        request.Adapt(variant);
        _unitOfWork.ProductVariants.Update(variant);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProductVariantResponse>.Success(variant.Adapt<ProductVariantResponse>());
    }

    public async Task<Result<bool>> DeleteVariantAsync(Guid productId, Guid variantId)
    {
        var variant = await _unitOfWork.ProductVariants.GetByIdAsync(variantId);
        if (variant is null || variant.ProductId != productId)
            return Result<bool>.Failure("Variant not found", ErrorType.NotFound);

        _unitOfWork.ProductVariants.Delete(variant);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
