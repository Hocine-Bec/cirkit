using Application.DTOs.Cart;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICheckoutService _checkoutService;
    public CartController(ICheckoutService checkoutService) => _checkoutService = checkoutService;

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] ValidateCartRequest request)
        => (await _checkoutService.ValidateCartAsync(request)).HandleResult();
}
