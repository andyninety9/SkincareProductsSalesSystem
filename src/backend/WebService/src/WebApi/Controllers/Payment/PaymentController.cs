using WebApi.Common;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Application.Abstractions.Payment;
using Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Application.Features.Payment.Commands;
using Application.Constant;

namespace WebApi.Controllers.Payment
{
    /// <summary>
    /// Payment Controller for handling payment-related operations.
    /// Provides endpoints for creating payments and processing payment returns.
    /// </summary>
    [Route("api/[controller]")]
    public class PaymentController : ApiController
    {
        private readonly ILogger<PaymentController> _logger;
        public PaymentController(IMediator mediator, ILogger<PaymentController> logger) : base(mediator)
        {
            _logger = logger;
        }

        /// <summary>
        /// Creates a new payment for an order.
        /// </summary>
        /// <param name="paymentRequest">Payment details including order ID, payment method, status, amount, and date.</param>
        /// <returns>Returns the payment URL if successful.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/Payment/create
        ///     {
        ///         "OrderId": "681688735040929792",
        ///         "PaymentAmount": 2750000,
        ///         "PaymentMethod": "VNPay"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentCommand paymentRequest)
        {
            _logger.LogInformation("Received payment request for Order ID: {OrderId}", paymentRequest.OrderId);

            var result = await _mediator.Send(paymentRequest);
            if (!result.IsSuccess)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = "Failed to create payment.",
                    data = result.Error
                });
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.CREATE_PAYMENT_SUCCESS,
                data = new { paymentUrl = result.Value.PaymentUrl }
            });
        }

        /// <summary>
        /// Handles the return from a payment provider.
        /// </summary>
        /// <param name="paymentDto">Payment return details containing order ID and provider response.</param>
        /// <returns>Returns the payment confirmation details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Payment/payment-return?orderId=123&status=success
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpGet("payment-return")]
        [Authorize]
        public async Task<IActionResult> PaymentReturn([FromQuery] PaymentReturnCommand paymentDto)
        {
            _logger.LogInformation("Received payment return request for Order ID: {OrderId}", paymentDto.OrderId);

            var result = await _mediator.Send(paymentDto);
            if (!result.IsSuccess)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = "Failed to return payment.",
                    data = result.Error
                });
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.PAYMENT_RETURN_SUCCESS,
                data = result.Value
            });
            
        }



    }
}