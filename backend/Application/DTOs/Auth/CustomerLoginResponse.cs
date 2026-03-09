namespace Application.DTOs.Auth;
public record CustomerLoginResponse(Guid Id, string FirstName, string LastName, string Email, string Token);
