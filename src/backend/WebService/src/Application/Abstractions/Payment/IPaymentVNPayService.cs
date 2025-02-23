using Domain.DTOs;

namespace Application.Abstractions.Payment
{
    public interface IPaymentVNPayService
    {
        public Task<PaymentResponseDto> CreatePaymentAsync(PaymentDto paymentRequest, double amount);
        public Task<PaymentResponseDto> CheckTransactionStatus(string orderId);

        public bool VerifySecureHash(string secureHash, Dictionary<string, string> parameters);

    }
}