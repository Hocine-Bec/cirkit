using Application.DTOs.Auth;
using Application.DTOs.Customer;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface ICustomerService
{
    Task<Result<IEnumerable<CustomerResponse>>> GetAllAsync();
    Task<Result<CustomerDetailResponse>> GetByIdAsync(Guid id);
    // Account management
    Task<Result<CustomerLoginResponse>> RegisterAsync(CustomerRegisterRequest request);
    Task<Result<CustomerLoginResponse>> LoginAsync(CustomerLoginRequest request);
    Task<Result<CustomerDetailResponse>> GetProfileAsync(Guid customerId);
    Task<Result<bool>> UpdateProfileAsync(Guid customerId, UpdateProfileRequest request);
    Task<Result<bool>> ChangePasswordAsync(Guid customerId, ChangePasswordRequest request);
    // Addresses
    Task<Result<IEnumerable<AddressResponse>>> GetAddressesAsync(Guid customerId);
    Task<Result<AddressResponse>> AddAddressAsync(Guid customerId, AddressRequest request);
    Task<Result<AddressResponse>> UpdateAddressAsync(Guid customerId, Guid addressId, AddressRequest request);
    Task<Result<bool>> DeleteAddressAsync(Guid customerId, Guid addressId);
}
