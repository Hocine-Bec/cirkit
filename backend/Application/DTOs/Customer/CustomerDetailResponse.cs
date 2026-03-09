namespace Application.DTOs.Customer;
public record CustomerDetailResponse(Guid Id, string FirstName, string LastName, string Email, string? Phone, DateTime CreatedAt, IEnumerable<AddressResponse> Addresses);
