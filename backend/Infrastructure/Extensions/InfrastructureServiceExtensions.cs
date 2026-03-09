using Application.Interfaces;
using Application.Interfaces.Services;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Payments;
using Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        var connectionString = Environment.GetEnvironmentVariable("DEFAULTCONNECTION")
            ?? throw new InvalidOperationException("DEFAULTCONNECTION not configured");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPaymentService, MockPaymentService>();

        return services;
    }
}
