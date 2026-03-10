namespace Application.Interfaces.Services;

public interface IPaymentService
{
    /// <summary>
    /// Creates a payment intent. In mock mode, returns a fake client secret.
    /// When Stripe is integrated, swap MockPaymentService for StripePaymentService — no other changes needed.
    /// </summary>
    Task<PaymentResult> CreatePaymentIntentAsync(decimal amount, string currency = "usd");

    /// <summary>
    /// Processes a refund. In mock mode, always succeeds.
    /// </summary>
    Task<bool> ProcessRefundAsync(string paymentIntentId, decimal? amount = null);
}

public record PaymentResult(string ClientSecret, string PaymentIntentId);
