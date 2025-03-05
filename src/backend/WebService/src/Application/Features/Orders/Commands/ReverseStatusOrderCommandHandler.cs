using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Orders.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Orders.Commands
{
    public sealed record ReverseStatusOrderCommand(
        long UserId,
        long OrderId,
        string? Note
    ) : ICommand<ChangeOrderStatusResponse>;
    internal sealed class ReverseStatusOrderCommandHandler : ICommandHandler<ReverseStatusOrderCommand, ChangeOrderStatusResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ReverseStatusOrderCommandHandler> _logger;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderLogRepository _orderLogRepository;
        private readonly IdGeneratorService _idGeneratorService;


        public ReverseStatusOrderCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, ILogger<ReverseStatusOrderCommandHandler> logger, IOrderRepository orderRepository, IOrderLogRepository orderLogRepository, IdGeneratorService idGeneratorService)
        {

            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _orderRepository = orderRepository;
            _orderLogRepository = orderLogRepository;
            _idGeneratorService = idGeneratorService;
        }
        public async Task<Result<ChangeOrderStatusResponse>> Handle(ReverseStatusOrderCommand command, CancellationToken cancellationToken)
        {
            try
            {
            var updatedOrder = await _orderRepository.ReverseStatusOrderAsync(command.OrderId, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (updatedOrder is null)
            {
                return Result.Failure<ChangeOrderStatusResponse>(new Error("UpdateFailed", "Failed to update order status"));
            }

            OrderLog newOrderLog = new()
            {
                OrdLogId = _idGeneratorService.GenerateLongId(),
                OrdId = updatedOrder.OrdId,
                NewStatusOrdId = updatedOrder.OrdStatusId,
                UsrId = command.UserId,
                Note = command.Note,
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
            };
            await _orderLogRepository.AddAsync(newOrderLog, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success(_mapper.Map<ChangeOrderStatusResponse>(updatedOrder));
            }
            catch (Exception ex)
            {
            return Result.Failure<ChangeOrderStatusResponse>(new Error("UnexpectedError", ex.Message));
            }
        }

    }
}