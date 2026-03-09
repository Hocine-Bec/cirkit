using Application.DTOs.Category;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    public CategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => (await _categoryService.GetAllAsync()).HandleResult();

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
        => (await _categoryService.GetBySlugAsync(slug)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryRequest request)
        => (await _categoryService.CreateAsync(request)).HandleResult(201);

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryRequest request)
        => (await _categoryService.UpdateAsync(id, request)).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
        => (await _categoryService.DeleteAsync(id)).HandleResult();
}
