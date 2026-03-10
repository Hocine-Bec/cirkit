namespace Application.Interfaces.Services;

public interface IValidationService
{
    Task<Application.Shared.Result> ValidateAsync<T>(T model) where T : class;
}
