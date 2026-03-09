using Application.Interfaces.Services;
using Application.Shared;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Services;

public class ValidationService : IValidationService
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationService(IServiceProvider serviceProvider) => _serviceProvider = serviceProvider;

    public async Task<Result> ValidateAsync<T>(T model) where T : class
    {
        var validator = _serviceProvider.GetService<IValidator<T>>();
        if (validator is null) return Result.Success;

        var result = await validator.ValidateAsync(model);
        if (result.IsValid) return Result.Success;

        var errors = string.Join("; ", result.Errors.Select(e => e.ErrorMessage));
        return Result.Failure(errors, ErrorType.BadRequest);
    }
}
