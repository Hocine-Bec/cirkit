using Application.DTOs.Auth;
using Application.DTOs.Customer;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;

namespace Application.Services;

public class CustomerService : ICustomerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthService _authService;
    private readonly IValidationService _validation;

    public CustomerService(IUnitOfWork unitOfWork, IAuthService authService, IValidationService validation)
    {
        _unitOfWork = unitOfWork;
        _authService = authService;
        _validation = validation;
    }

    public async Task<Result<IEnumerable<CustomerResponse>>> GetAllAsync()
    {
        var customers = await _unitOfWork.Customers.GetAllAsync();
        return Result<IEnumerable<CustomerResponse>>.Success(customers.Adapt<IEnumerable<CustomerResponse>>());
    }

    public async Task<Result<CustomerDetailResponse>> GetByIdAsync(Guid id)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer is null)
            return Result<CustomerDetailResponse>.Failure("Customer not found", ErrorType.NotFound);

        var addresses = await _unitOfWork.Addresses.GetByCustomerIdAsync(id);
        var response = new CustomerDetailResponse(
            customer.Id, customer.FirstName, customer.LastName,
            customer.Email, customer.Phone, customer.CreatedAt,
            addresses.Adapt<IEnumerable<AddressResponse>>());

        return Result<CustomerDetailResponse>.Success(response);
    }

    public async Task<Result<CustomerLoginResponse>> RegisterAsync(CustomerRegisterRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<CustomerLoginResponse>.Failure(validation.Error, validation.ErrorType);

        if (await _unitOfWork.Customers.GetByEmailAsync(request.Email) is not null)
            return Result<CustomerLoginResponse>.Failure("Email is already registered", ErrorType.Conflict);

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = _authService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.SaveChangesAsync();

        var token = _authService.GenerateCustomerToken(customer);
        return Result<CustomerLoginResponse>.Success(
            new CustomerLoginResponse(customer.Id, customer.FirstName, customer.LastName, customer.Email, token));
    }

    public async Task<Result<CustomerLoginResponse>> LoginAsync(CustomerLoginRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<CustomerLoginResponse>.Failure(validation.Error, validation.ErrorType);

        var customer = await _unitOfWork.Customers.GetByEmailAsync(request.Email);
        if (customer is null || !_authService.VerifyPassword(request.Password, customer.PasswordHash))
            return Result<CustomerLoginResponse>.Failure("Invalid email or password", ErrorType.Unauthorized);

        var token = _authService.GenerateCustomerToken(customer);
        return Result<CustomerLoginResponse>.Success(
            new CustomerLoginResponse(customer.Id, customer.FirstName, customer.LastName, customer.Email, token));
    }

    public async Task<Result<CustomerDetailResponse>> GetProfileAsync(Guid customerId)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(customerId);
        if (customer is null)
            return Result<CustomerDetailResponse>.Failure("Customer not found", ErrorType.NotFound);

        var addresses = await _unitOfWork.Addresses.GetByCustomerIdAsync(customerId);
        var response = new CustomerDetailResponse(
            customer.Id, customer.FirstName, customer.LastName,
            customer.Email, customer.Phone, customer.CreatedAt,
            addresses.Adapt<IEnumerable<AddressResponse>>());

        return Result<CustomerDetailResponse>.Success(response);
    }

    public async Task<Result<bool>> UpdateProfileAsync(Guid customerId, UpdateProfileRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<bool>.Failure(validation.Error, validation.ErrorType);

        var customer = await _unitOfWork.Customers.GetByIdAsync(customerId);
        if (customer is null)
            return Result<bool>.Failure("Customer not found", ErrorType.NotFound);

        if (!string.Equals(customer.Email, request.Email, StringComparison.OrdinalIgnoreCase))
        {
            if (await _unitOfWork.Customers.GetByEmailAsync(request.Email) is not null)
                return Result<bool>.Failure("Email is already in use", ErrorType.Conflict);
        }

        customer.FirstName = request.FirstName;
        customer.LastName = request.LastName;
        customer.Email = request.Email;

        _unitOfWork.Customers.Update(customer);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> ChangePasswordAsync(Guid customerId, ChangePasswordRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<bool>.Failure(validation.Error, validation.ErrorType);

        var customer = await _unitOfWork.Customers.GetByIdAsync(customerId);
        if (customer is null)
            return Result<bool>.Failure("Customer not found", ErrorType.NotFound);

        if (!_authService.VerifyPassword(request.CurrentPassword, customer.PasswordHash))
            return Result<bool>.Failure("Current password is incorrect", ErrorType.BadRequest);

        customer.PasswordHash = _authService.HashPassword(request.NewPassword);
        _unitOfWork.Customers.Update(customer);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<IEnumerable<AddressResponse>>> GetAddressesAsync(Guid customerId)
    {
        var addresses = await _unitOfWork.Addresses.GetByCustomerIdAsync(customerId);
        return Result<IEnumerable<AddressResponse>>.Success(addresses.Adapt<IEnumerable<AddressResponse>>());
    }

    public async Task<Result<AddressResponse>> AddAddressAsync(Guid customerId, AddressRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<AddressResponse>.Failure(validation.Error, validation.ErrorType);

        if (!await _unitOfWork.Customers.ExistsAsync(c => c.Id == customerId))
            return Result<AddressResponse>.Failure("Customer not found", ErrorType.NotFound);

        if (request.IsDefault)
        {
            var existingAddresses = await _unitOfWork.Addresses.GetByCustomerIdAsync(customerId);
            foreach (var addr in existingAddresses.Where(a => a.IsDefault))
            {
                addr.IsDefault = false;
                _unitOfWork.Addresses.Update(addr);
            }
        }

        var address = request.Adapt<Address>();
        address.CustomerId = customerId;

        await _unitOfWork.Addresses.AddAsync(address);
        await _unitOfWork.SaveChangesAsync();

        return Result<AddressResponse>.Success(address.Adapt<AddressResponse>());
    }

    public async Task<Result<AddressResponse>> UpdateAddressAsync(Guid customerId, Guid addressId, AddressRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<AddressResponse>.Failure(validation.Error, validation.ErrorType);

        var address = await _unitOfWork.Addresses.GetByIdAsync(addressId);
        if (address is null || address.CustomerId != customerId)
            return Result<AddressResponse>.Failure("Address not found", ErrorType.NotFound);

        if (request.IsDefault && !address.IsDefault)
        {
            var existingAddresses = await _unitOfWork.Addresses.GetByCustomerIdAsync(customerId);
            foreach (var addr in existingAddresses.Where(a => a.IsDefault && a.Id != addressId))
            {
                addr.IsDefault = false;
                _unitOfWork.Addresses.Update(addr);
            }
        }

        request.Adapt(address);
        _unitOfWork.Addresses.Update(address);
        await _unitOfWork.SaveChangesAsync();

        return Result<AddressResponse>.Success(address.Adapt<AddressResponse>());
    }

    public async Task<Result<bool>> DeleteAddressAsync(Guid customerId, Guid addressId)
    {
        var address = await _unitOfWork.Addresses.GetByIdAsync(addressId);
        if (address is null || address.CustomerId != customerId)
            return Result<bool>.Failure("Address not found", ErrorType.NotFound);

        _unitOfWork.Addresses.Delete(address);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
