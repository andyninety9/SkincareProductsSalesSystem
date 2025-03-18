using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.Payment;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace Application.Features.Payment.Commands
{
    //Body: { "fullname": "string", "username": "string", "email": "string", "phoneNumber": "string", roleId: "short"}
    public sealed record PaymentReturnCommand
    (
        long OrderId,
        string Vnp_TransactionStatus,
        string Vnp_SecureHash,
        double Vnp_Amount,
        string Method
    ) : ICommand<PaymentResponseDto>;

    internal sealed class PaymentReturnCommandHandler : ICommandHandler<PaymentReturnCommand, PaymentResponseDto>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PaymentReturnCommandHandler> _logger;
        private readonly IPaymentVNPayService _paymentVNPayService;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;

        public PaymentReturnCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<PaymentReturnCommandHandler> logger,
            IPaymentVNPayService paymentVNPayService,
            IPaymentRepository paymentRepository,
            IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _paymentVNPayService = paymentVNPayService;
            _paymentRepository = paymentRepository;
        }

        public async Task<Result<PaymentResponseDto>> Handle(PaymentReturnCommand command, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing VNPay callback for Order ID: {OrderId}", command.OrderId);

            try
            {
                var payment = await _paymentRepository.GetPaymentByOrderIdAsync(command.OrderId);
                if (payment == null)
                {
                    _logger.LogError("Payment not found for Order ID: {OrderId}", command.OrderId);
                    return Result<PaymentResponseDto>.Failure<PaymentResponseDto>(new Error("PaymentNotFound", "Payment record not found."));
                }else if(payment.PaymentStatus == true){
                    _logger.LogError("Payment already verified for Order ID: {OrderId}", command.OrderId);
                    return Result<PaymentResponseDto>.Failure<PaymentResponseDto>(new Error("PaymentAlreadyVerified", "Payment record already verified."));
                }

                if (command.Vnp_TransactionStatus == "00")
                {
                    payment.PaymentStatus = true;
                    payment.PaymentMethod = command.Method;
                    payment.PaymentAmount = command.Vnp_Amount / 100;
                    payment.CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

                    var order = await _orderRepository.GetByIdAsync(command.OrderId, cancellationToken);

                    if (order == null)
                    {
                        _logger.LogError("Order not found for Order ID: {OrderId}", command.OrderId);
                        return Result<PaymentResponseDto>.Failure<PaymentResponseDto>(new Error("OrderNotFound", "Order record not found."));
                    }
                    
                    order.IsPaid = true;
                }
                else
                {
                    payment.PaymentStatus = false; // Thất bại
                    _logger.LogWarning("Payment failed for Order ID: {OrderId}, Status: {Status}", command.OrderId, command.Vnp_TransactionStatus);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken); // ✅ Lưu thay đổi trực tiếp

                _logger.LogInformation("Payment successfully updated for Order ID: {OrderId}", command.OrderId);

                // ✅ 5. Trả về kết quả thanh toán
                return Result<PaymentResponseDto>.Success(new PaymentResponseDto
                {
                    Success = payment.PaymentStatus,
                    Message = payment.PaymentStatus ? "Payment successfully verified." : "Payment failed.",
                    TransactionId = command.OrderId.ToString(),
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing VNPay callback for Order ID: {OrderId}", command.OrderId);
                return Result<PaymentResponseDto>.Failure<PaymentResponseDto>(new Error("InternalServerError", "Internal server error while processing payment."));
            }
        }
    }



}