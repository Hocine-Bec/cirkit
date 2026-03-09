using Application.DTOs.Cart;
using Application.DTOs.Checkout;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface ICheckoutService
{
    Task<Result<CheckoutResponse>> ProcessCheckoutAsync(Guid customerId, CheckoutRequest request);
    Task<Result<ValidateCartResponse>> ValidateCartAsync(ValidateCartRequest request);
}
