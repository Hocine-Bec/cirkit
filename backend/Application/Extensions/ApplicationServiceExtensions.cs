using Application.Interfaces.Services;
using Application.Mappers;
using Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Mapster
        MappingConfig.RegisterMappings();

        // FluentValidation — auto-register all validators in this assembly
        services.AddValidatorsFromAssembly(typeof(ApplicationServiceExtensions).Assembly);

        // Services
        services.AddScoped<IValidationService, ValidationService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<ICheckoutService, CheckoutService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        return services;
    }
}
