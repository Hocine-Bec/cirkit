using System.Text.Json;
using Application.DTOs.Cart;
using Application.DTOs.Checkout;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services;

public class CheckoutService : ICheckoutService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPaymentService _paymentService;
    private readonly IValidationService _validation;

    private const decimal FreeShippingThreshold = 100m;
    private const decimal ShippingCost = 9.99m;
    private const decimal TaxRate = 0.085m;

    public CheckoutService(IUnitOfWork unitOfWork, IPaymentService paymentService, IValidationService validation)
    {
        _unitOfWork = unitOfWork;
        _paymentService = paymentService;
        _validation = validation;
    }

    public async Task<Result<CheckoutResponse>> ProcessCheckoutAsync(Guid customerId, CheckoutRequest request)
    {
        var validation = await _validation.ValidateAsync(request);
        if (!validation.IsSuccess)
            return Result<CheckoutResponse>.Failure(validation.Error, validation.ErrorType);

        if (!await _unitOfWork.Customers.ExistsAsync(c => c.Id == customerId))
            return Result<CheckoutResponse>.Failure("Customer not found", ErrorType.NotFound);

        // Validate cart
        var cartItems = request.Items.Select(i => new CartItemRequest(i.ProductId, i.ProductVariantId, i.Quantity));
        var cartResult = await ValidateCartAsync(new ValidateCartRequest(cartItems));
        if (!cartResult.IsSuccess)
            return Result<CheckoutResponse>.Failure(cartResult.Error, cartResult.ErrorType);

        var validatedCart = cartResult.Value!;
        if (!validatedCart.IsValid)
            return Result<CheckoutResponse>.Failure(string.Join("; ", validatedCart.Errors), ErrorType.BadRequest);

        var validatedItems = validatedCart.Items.ToList();

        // Calculate totals
        var subtotal = validatedItems.Sum(i => i.UnitPrice * i.Quantity);
        var shipping = subtotal >= FreeShippingThreshold ? 0m : ShippingCost;
        var tax = Math.Round(subtotal * TaxRate, 2);
        var total = subtotal + shipping + tax;

        // Snapshot shipping address
        var addressSnapshot = JsonSerializer.Serialize(request.ShippingAddress);

        // Generate order number + payment intent
        var orderNumber = await _unitOfWork.Orders.GenerateOrderNumberAsync();
        var paymentResult = await _paymentService.CreatePaymentIntentAsync(total);

        // Build order
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            OrderNumber = orderNumber,
            Status = OrderStatus.Processing,
            SubTotal = subtotal,
            ShippingCost = shipping,
            Tax = tax,
            Total = total,
            PaymentMethod = PaymentMethod.Mock,
            StripePaymentIntentId = paymentResult.PaymentIntentId,
            ShippingAddressSnapshot = addressSnapshot,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var orderItems = validatedItems.Select(item => new OrderItem
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            ProductId = item.ProductId,
            ProductVariantId = item.ProductVariantId,
            ProductName = item.ProductName,
            VariantName = item.VariantName,
            UnitPrice = item.UnitPrice,
            Quantity = item.Quantity,
            Total = item.UnitPrice * item.Quantity
        }).ToList();

        order.Items = orderItems;

        await _unitOfWork.Orders.AddAsync(order);

        // Decrement stock
        foreach (var item in validatedItems)
        {
            if (item.ProductVariantId.HasValue)
            {
                var variant = await _unitOfWork.ProductVariants.GetByIdAsync(item.ProductVariantId.Value);
                if (variant is not null)
                {
                    variant.StockQuantity -= item.Quantity;
                    _unitOfWork.ProductVariants.Update(variant);
                }
            }
            else
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                if (product is not null)
                {
                    product.StockQuantity -= item.Quantity;
                    _unitOfWork.Products.Update(product);
                }
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<CheckoutResponse>.Success(new CheckoutResponse(
            order.Id,
            order.OrderNumber,
            order.Total,
            null, // no client secret for mock payments
            order.PaymentMethod.ToString()
        ));
    }

    public async Task<Result<ValidateCartResponse>> ValidateCartAsync(ValidateCartRequest request)
    {
        var validatedItems = new List<ValidatedCartItem>();
        var errors = new List<string>();

        foreach (var item in request.Items)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
            if (product is null || !product.IsActive)
            {
                errors.Add($"Product {item.ProductId} is not available");
                continue;
            }

            string? variantName = null;
            var unitPrice = product.BasePrice;
            var availableStock = product.StockQuantity;

            if (item.ProductVariantId.HasValue)
            {
                var variant = await _unitOfWork.ProductVariants.GetByIdAsync(item.ProductVariantId.Value);
                if (variant is null || !variant.IsActive)
                {
                    errors.Add($"{product.Name} - selected variant is not available");
                    continue;
                }
                variantName = variant.Name;
                unitPrice = product.BasePrice + variant.PriceModifier;
                availableStock = variant.StockQuantity;
            }

            var isAvailable = availableStock >= item.Quantity;
            if (!isAvailable)
                errors.Add($"{product.Name} - insufficient stock (available: {availableStock}, requested: {item.Quantity})");

            validatedItems.Add(new ValidatedCartItem(
                item.ProductId,
                item.ProductVariantId,
                product.Name,
                variantName,
                unitPrice,
                item.Quantity,
                availableStock,
                isAvailable,
                product.ImageUrl
            ));
        }

        return Result<ValidateCartResponse>.Success(
            new ValidateCartResponse(validatedItems, errors.Count == 0, errors));
    }
}
