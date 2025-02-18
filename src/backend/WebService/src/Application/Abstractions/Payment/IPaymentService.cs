using Domain.DTOs;

namespace Application.Abstractions.Payment
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreatePaymentUrl(PaymentRequestDto request);
        Task<PaymentCallbackResponseDto> ValidatePaymentResponse(Dictionary<string, string> queryParams);
        Task<PaymentStatusDto> GetPaymentStatus(string orderId);
        
    }
}