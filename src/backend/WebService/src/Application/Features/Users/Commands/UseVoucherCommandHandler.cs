using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Users.Commands
{

    public sealed record UseVoucherCommand
    (
        string OrderId,
        string VoucherCode
    ) : ICommand<GetUserVoucherResponse>;
    

    internal sealed class UseVoucherCommandHandler : ICommandHandler<UseVoucherCommand, GetUserVoucherResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UseVoucherCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IVoucherRepository _voucherRepository;
        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;

        public UseVoucherCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UseVoucherCommandHandler> logger,
            IdGeneratorService idGenerator, IVoucherRepository voucherRepository,
            IUserRepository userRepository,
            IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
            _voucherRepository = voucherRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }


        
        public async Task<Result<GetUserVoucherResponse>> Handle(UseVoucherCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var voucher = await _voucherRepository.GetByCodeAsync(command.VoucherCode, cancellationToken);
                if (voucher == null)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.NotFound", "Voucher not found"));
                }

                if (voucher.StatusVoucher == false)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Inactive", "Voucher has been used"));
                }
                
                if (!long.TryParse(command.OrderId, out var orderId))
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Use", "Invalid Order Id"));
                }

                var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
                if (order == null)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Use", "Order not found"));
                }

                order.VoucherCodeApplied = voucher.VoucherCode;

                _orderRepository.Update(order);

                voucher.StatusVoucher = false;

                _voucherRepository.Update(voucher);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<GetUserVoucherResponse>.Success(_mapper.Map<GetUserVoucherResponse>(voucher));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Create", e.Message));
            }

        }

    }
}
