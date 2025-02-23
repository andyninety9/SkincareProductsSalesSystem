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
    [Route("api/[controller]")]
    public class PaymentController : ApiController
    {
        private readonly ILogger<PaymentController> _logger;
        public PaymentController(IMediator mediator, ILogger<PaymentController> logger) : base(mediator)
        {
            _logger = logger;
        }

        // POST: api/Payment/create
        // {
        //     "orderId": 0,
        //     "paymentMethod": 0,
        //     "paymentStatus": 0,
        //     "paymentAmount": 0,
        //     "paymentDate": "2021-09-29T07:00:00.000Z"
        // }
        // [Authorize]
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

        // PaymentReturn
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