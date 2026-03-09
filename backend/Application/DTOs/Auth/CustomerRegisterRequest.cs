namespace Application.DTOs.Auth;
public record CustomerRegisterRequest(string FirstName, string LastName, string Email, string Password);
