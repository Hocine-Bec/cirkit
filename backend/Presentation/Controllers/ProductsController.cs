using Application.DTOs.Product;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    public ProductsController(IProductService productService) => _productService = productService;

    [HttpGet]
    public async Task<IActionResult> GetFiltered(
        [FromQuery] Guid? categoryId,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStock,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
        => (await _productService.GetFilteredAsync(categoryId, brand, minPrice, maxPrice, inStock, sortBy, page, pageSize)).HandleResult();

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
        => (await _productService.GetFeaturedAsync()).HandleResult();

    [HttpGet("new-arrivals")]
    public async Task<IActionResult> GetNewArrivals()
        => (await _productService.GetNewArrivalsAsync()).HandleResult();

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
        => (await _productService.GetBySlugAsync(slug)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductRequest request)
        => (await _productService.CreateAsync(request)).HandleResult(201);

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ProductRequest request)
        => (await _productService.UpdateAsync(id, request)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
        => (await _productService.DeleteAsync(id)).HandleResult();

    // Images

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id:guid}/images")]
    public async Task<IActionResult> AddImage(Guid id, [FromBody] ProductImageRequest request)
        => (await _productService.AddImageAsync(id, request)).HandleResult(201);

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> UpdateImage(Guid id, Guid imageId, [FromBody] ProductImageRequest request)
        => (await _productService.UpdateImageAsync(id, imageId, request)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("{id:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteImage(Guid id, Guid imageId)
        => (await _productService.DeleteImageAsync(id, imageId)).HandleResult();

    // Variants

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id:guid}/variants")]
    public async Task<IActionResult> AddVariant(Guid id, [FromBody] ProductVariantRequest request)
        => (await _productService.AddVariantAsync(id, request)).HandleResult(201);

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:guid}/variants/{variantId:guid}")]
    public async Task<IActionResult> UpdateVariant(Guid id, Guid variantId, [FromBody] ProductVariantRequest request)
        => (await _productService.UpdateVariantAsync(id, variantId, request)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("{id:guid}/variants/{variantId:guid}")]
    public async Task<IActionResult> DeleteVariant(Guid id, Guid variantId)
        => (await _productService.DeleteVariantAsync(id, variantId)).HandleResult();
}
