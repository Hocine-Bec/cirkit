namespace Application.DTOs.Customer;
public record AddressRequest(string Label, string Street, string City, string State, string ZipCode, string Country, bool IsDefault);
