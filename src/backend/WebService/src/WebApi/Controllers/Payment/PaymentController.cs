using WebApi.Common;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Application.Abstractions.Payment;
using Domain.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers.Payment
{
    [Route("api/[controller]")]
    public class PaymentController : ApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;
        public PaymentController(IMediator mediator, IPaymentService paymentService, ILogger<PaymentController> logger) : base(mediator)
        {
            _paymentService = paymentService;
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
        public async Task<IActionResult> Create([FromBody] PaymentRequestDto request, CancellationToken cancellationToken)
        {
            var result = await _paymentService.CreatePaymentUrl(request);
            return Ok(new { statusCode = 200, message = "Create payment success", data = result });
        }

        // Callback from payment gateway
        // GET: api/Payment/callback
        [HttpGet("callback")]
        public async Task<IActionResult> VNPayCallback()
        {
            var queryParams = Request.Query.ToDictionary(k => k.Key, v => v.Value.ToString());
            _logger.LogInformation("VNPay Callback received: {0}", queryParams);

            var response = await _paymentService.ValidatePaymentResponse(queryParams);

            return response.Success
                ? Ok(new { success = true, message = "Payment successful", orderId = response.OrderId, amount = response.Amount })
                : BadRequest(new { success = false, message = "Payment failed" });
        }

        [HttpGet("status/{orderId}")]
        public async Task<IActionResult> GetPaymentStatus(string orderId)
        {
            var status = await _paymentService.GetPaymentStatus(orderId);
            return Ok(status);
        }


    }
}