using Application.Interfaces.Services;

namespace Infrastructure.Payments;

/// <summary>
/// Mock payment service for demo/portfolio mode — no real charges.
/// To integrate Stripe: create StripePaymentService : IPaymentService in this folder,
/// register it in InfrastructureServiceExtensions in place of MockPaymentService.
/// No other code changes needed.
/// </summary>
public class MockPaymentService : IPaymentService
{
    public Task<PaymentResult> CreatePaymentIntentAsync(decimal amount, string currency = "usd")
    {
        var intentId = $"pi_mock_{Guid.NewGuid():N}";
        var clientSecret = $"{intentId}_secret_{Guid.NewGuid():N}";
        return Task.FromResult(new PaymentResult(clientSecret, intentId));
    }

    public Task<bool> ProcessRefundAsync(string paymentIntentId, decimal? amount = null)
    {
        // Mock always succeeds
        return Task.FromResult(true);
    }
}
