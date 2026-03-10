using Application.DTOs.Checkout;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutService _checkoutService;
    public CheckoutController(ICheckoutService checkoutService) => _checkoutService = checkoutService;

    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        => (await _checkoutService.ProcessCheckoutAsync(User.GetUserId(), request)).HandleResult(201);
}
