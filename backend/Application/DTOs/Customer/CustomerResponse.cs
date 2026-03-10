namespace Application.DTOs.Customer;
public record CustomerResponse(Guid Id, string FirstName, string LastName, string Email, string? Phone, DateTime CreatedAt, int OrderCount, decimal TotalSpent);
