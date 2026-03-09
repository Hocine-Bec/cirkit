using Application.DTOs.Customer;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    public CustomersController(ICustomerService customerService) => _customerService = customerService;

    // Customer self-service

    [Authorize(Roles = "Customer")]
    [HttpGet("account/profile")]
    public async Task<IActionResult> GetProfile()
        => (await _customerService.GetProfileAsync(User.GetUserId())).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpPut("account/profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        => (await _customerService.UpdateProfileAsync(User.GetUserId(), request)).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpPut("account/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        => (await _customerService.ChangePasswordAsync(User.GetUserId(), request)).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpGet("account/addresses")]
    public async Task<IActionResult> GetAddresses()
        => (await _customerService.GetAddressesAsync(User.GetUserId())).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpPost("account/addresses")]
    public async Task<IActionResult> AddAddress([FromBody] AddressRequest request)
        => (await _customerService.AddAddressAsync(User.GetUserId(), request)).HandleResult(201);

    [Authorize(Roles = "Customer")]
    [HttpPut("account/addresses/{id:guid}")]
    public async Task<IActionResult> UpdateAddress(Guid id, [FromBody] AddressRequest request)
        => (await _customerService.UpdateAddressAsync(User.GetUserId(), id, request)).HandleResult();

    [Authorize(Roles = "Customer")]
    [HttpDelete("account/addresses/{id:guid}")]
    public async Task<IActionResult> DeleteAddress(Guid id)
        => (await _customerService.DeleteAddressAsync(User.GetUserId(), id)).HandleResult();

    // Admin endpoints

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("admin/customers")]
    public async Task<IActionResult> GetAll()
        => (await _customerService.GetAllAsync()).HandleResult();

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("admin/customers/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => (await _customerService.GetByIdAsync(id)).HandleResult();
}
