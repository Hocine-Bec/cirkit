namespace Application.DTOs.Checkout;
public record ShippingAddressRequest(string Street, string City, string State, string ZipCode, string Country);
