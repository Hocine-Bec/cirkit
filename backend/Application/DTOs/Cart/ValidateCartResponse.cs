namespace Application.DTOs.Cart;
public record ValidateCartResponse(IEnumerable<ValidatedCartItem> Items, bool IsValid, IEnumerable<string> Errors);
