using Application.DTOs.Review;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    [HttpGet("products/{productId:guid}/reviews")]
    public async Task<IActionResult> GetByProduct(Guid productId)
        => (await _reviewService.GetByProductIdAsync(productId)).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpPost("products/{productId:guid}/reviews")]
    public async Task<IActionResult> Create(Guid productId, [FromBody] ReviewRequest request)
        => (await _reviewService.CreateAsync(User.GetUserId(), productId, request)).HandleResult(201);

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("admin/reviews")]
    public async Task<IActionResult> GetAll()
        => (await _reviewService.GetAllAsync()).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("admin/reviews/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
        => (await _reviewService.DeleteAsync(id)).HandleResult();
}
