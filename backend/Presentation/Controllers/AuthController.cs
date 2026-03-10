using Application.DTOs.Auth;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthService _authService;

    public AuthController(ICustomerService customerService, IUnitOfWork unitOfWork, IAuthService authService)
    {
        _customerService = customerService;
        _unitOfWork = unitOfWork;
        _authService = authService;
    }

    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginRequest request)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email);
        if (user is null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
            return Result<AdminLoginResponse>.Failure("Invalid email or password", ErrorType.Unauthorized).HandleResult();

        var token = _authService.GenerateAdminToken(user);
        var response = new AdminLoginResponse(user.Id, user.FullName, user.Email, user.Role.ToString(), token);
        return Result<AdminLoginResponse>.Success(response).HandleResult();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CustomerRegisterRequest request)
        => (await _customerService.RegisterAsync(request)).HandleResult(201);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] CustomerLoginRequest request)
        => (await _customerService.LoginAsync(request)).HandleResult();
}
