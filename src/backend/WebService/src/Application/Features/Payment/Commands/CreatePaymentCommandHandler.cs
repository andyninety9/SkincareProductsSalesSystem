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
    public sealed record CreatePaymentCommand
    (
        long OrderId,
        string PaymentMethod,
        double PaymentAmount
    ) : ICommand<PaymentResponseDto>;

    internal sealed class CreatePaymentCommandHandler : ICommandHandler<CreatePaymentCommand, PaymentResponseDto>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreatePaymentCommandHandler> _logger;

        private readonly IPaymentVNPayService _paymentVNPayService;
        private readonly IPaymentRepository _paymentRepository;

        public CreatePaymentCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreatePaymentCommandHandler> logger,
            IPaymentVNPayService paymentVNPayService,
            IPaymentRepository paymentRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _paymentVNPayService = paymentVNPayService;
            _paymentRepository = paymentRepository;
        }

        public async Task<Result<PaymentResponseDto>> Handle(CreatePaymentCommand command, CancellationToken cancellationToken)
        {
            Domain.Entities.Payment payment = new Domain.Entities.Payment
            {
                OrderId = command.OrderId,
                PaymentMethod = command.PaymentMethod,
                PaymentAmount = command.PaymentAmount,
                CreatedAt = DateTime.Now,
                PaymentStatus = false
            };

            await _paymentRepository.AddAsync(payment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            PaymentDto paymentDto = new()
            {
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                PaymentAmount = payment.PaymentAmount
            };
            var result = await _paymentVNPayService.CreatePaymentAsync(paymentDto, command.PaymentAmount);
            return Result<PaymentResponseDto>.Success(new PaymentResponseDto
            {
                PaymentUrl = result.PaymentUrl 
            });
        }
    }
}