using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _lifetimeMinutes;

    public AuthService()
    {
        _secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
            ?? throw new InvalidOperationException("JWT_SECRET_KEY not configured");
        _issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "CirKit";
        _audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "CirKitUsers";
        _lifetimeMinutes = int.Parse(
            Environment.GetEnvironmentVariable("JWT_LIFETIME_MINUTES") ?? "1440");
    }

    public string HashPassword(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password);

    public bool VerifyPassword(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);

    public string GenerateAdminToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("token_type", "admin")
        };
        return CreateToken(claims);
    }

    public string GenerateCustomerToken(Customer customer)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
            new Claim(ClaimTypes.Email, customer.Email),
            new Claim(ClaimTypes.Name, $"{customer.FirstName} {customer.LastName}"),
            new Claim(ClaimTypes.Role, "Customer"),
            new Claim("token_type", "customer")
        };
        return CreateToken(claims);
    }

    private string CreateToken(Claim[] claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_lifetimeMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
