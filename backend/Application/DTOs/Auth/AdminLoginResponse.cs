namespace Application.DTOs.Auth;
public record AdminLoginResponse(Guid Id, string FullName, string Email, string Role, string Token);
