namespace Application.Interfaces.Services;

public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    string GenerateAdminToken(Domain.Entities.User user);
    string GenerateCustomerToken(Domain.Entities.Customer customer);
}
