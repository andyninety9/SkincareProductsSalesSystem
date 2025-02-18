using Domain.DTOs;

namespace Application.Abstractions.Payment
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreatePaymentUrl(PaymentRequestDto request);
        Task<bool> ValidatePaymentResponse(PaymentResponseDto response);
    }
}