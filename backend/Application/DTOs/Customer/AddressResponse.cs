namespace Application.DTOs.Customer;
public record AddressResponse(Guid Id, Guid CustomerId, string Label, string Street, string City, string State, string ZipCode, string Country, bool IsDefault);
