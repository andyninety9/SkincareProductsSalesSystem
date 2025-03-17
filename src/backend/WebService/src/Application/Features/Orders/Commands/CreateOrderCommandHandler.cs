using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.Enum;
using Application.Common.ResponseModel;
using Application.Features.Orders.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Orders.Commands
{
    public sealed record CreateOrderCommand(
        long ?UserId,
        long ?EventId,
        string? VoucherCodeApplied,
        List<OrderItem> OrderItems
    ) : ICommand<CreateOrderResponse>;
    internal sealed class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand, CreateOrderResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<CreateOrderCommandHandler> _logger;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderLogRepository _orderLogRepository;
        private readonly IdGeneratorService _idGeneratorService;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IWarantyOrderRepository _warantyOrderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IVoucherRepository _voucherRepository;

        public CreateOrderCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateOrderCommandHandler> logger,
            IOrderRepository orderRepository,
            IOrderLogRepository orderLogRepository,
            IdGeneratorService idGeneratorService,
            IOrderDetailRepository orderDetailRepository,
            IWarantyOrderRepository warantyOrderRepository,
            IProductRepository productRepository,
            IVoucherRepository voucherRepository)
        {
            _voucherRepository = voucherRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _orderRepository = orderRepository;
            _orderLogRepository = orderLogRepository;
            _idGeneratorService = idGeneratorService;
            _orderDetailRepository = orderDetailRepository;
            _warantyOrderRepository = warantyOrderRepository;
            _productRepository = productRepository;
        }

        public async Task<Result<CreateOrderResponse>> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
        {
            var strategy = _unitOfWork.CreateExecutionStrategy(); // Lấy execution strategy của EF Core

            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);

                try
                {
                    _logger.LogInformation("Starting CreateOrderCommandHandler for UserId: {UserId}", command.UserId);

                    // 1️⃣ Kiểm tra danh sách sản phẩm
                    if (command.OrderItems == null || !command.OrderItems.Any())
                    {
                        throw new ValidationException("Order must contain at least one product.");
                    }
                    Domain.Entities.Voucher? voucher = null;
                    if (command.VoucherCodeApplied != null)
                    {
                        voucher = await _voucherRepository.GetByCodeAsync(command.VoucherCodeApplied, cancellationToken);
                        if (voucher == null)
                        {
                            throw new KeyNotFoundException("Voucher code is not valid.");
                        }
                    }

                    // 2️⃣ Kiểm tra sản phẩm có tồn tại trong kho không
                    var productIds = command.OrderItems.Select(x => x.ProductId).ToList();
                    var products = await _productRepository.GetProductByListIdAsync(productIds, cancellationToken);
                    if (products.Count() != productIds.Count)
                    {
                        throw new KeyNotFoundException("Some products in the order do not exist.");
                    }

                    // 3️⃣ Kiểm tra tồn kho trước khi tạo đơn hàng
                    foreach (var item in command.OrderItems)
                    {
                        var product = products.FirstOrDefault(p => p.ProductId == item.ProductId);
                        if (product == null || product.Stocks < item.Quantity)
                        {
                            throw new InvalidOperationException($"Product {item.ProductId} is out of stock.");
                        }
                    }

                    // 4️⃣ Tính tổng tiền đơn hàng
                    double totalPrice = command.OrderItems.Sum(item =>
                        item.Quantity * (item.DiscountedPrice > 0
                            ? item.DiscountedPrice
                            : item.SellPrice));
                    if (totalPrice <= 0)
                    {
                        throw new ValidationException("Total price must be greater than zero.");
                    }

                    if (voucher != null)
                    {
                        totalPrice -= ((totalPrice * voucher.VoucherDiscount) / 100);
                    }

                    // 5️⃣ Tạo đơn hàng
                    var newOrder = new Order
                    {
                        OrdId = _idGeneratorService.GenerateLongId(),
                        UsrId = command.UserId ?? throw new ArgumentNullException(nameof(command.UserId), "User ID cannot be null"),
                        EventId = command.EventId,
                        OrdDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        OrdStatusId = (short)OrderStatusEnum.Pending,
                        TotalOrdPrice = totalPrice,
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        VoucherCodeApplied = command.VoucherCodeApplied ?? string.Empty,
                        IsPaid = false
                    };

                    await _orderRepository.AddAsync(newOrder, cancellationToken);

                    // 6️⃣ Tạo danh sách chi tiết đơn hàng
                    var orderDetails = command.OrderItems.Select(item => new OrderDetail
                    {
                        OrdDetailId = _idGeneratorService.GenerateLongId(),
                        OrdId = newOrder.OrdId,
                        ProdId = item.ProductId,
                        Quantity = item.Quantity,
                        SellPrice = item.SellPrice
                    }).ToList();

                    await _orderDetailRepository.AddRangeAsync(orderDetails, cancellationToken);

                    // 7️⃣ Ghi log trạng thái đơn hàng
                    var orderLog = new OrderLog
                    {
                        OrdLogId = _idGeneratorService.GenerateLongId(),
                        UsrId = command.UserId.Value,
                        OrdId = newOrder.OrdId,
                        NewStatusOrdId = (short)OrderStatusEnum.Pending,
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
                    };

                    await _orderLogRepository.AddAsync(orderLog, cancellationToken);

                    // 8️⃣ Thêm bảo hành (30 ngày)
                    var warrantyOrder = new WarantyOrder
                    {
                        WarantyId = _idGeneratorService.GenerateLongId(),
                        OrdId = newOrder.OrdId,
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        EndDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified).AddDays(30)
                    };

                    await _warantyOrderRepository.AddAsync(warrantyOrder, cancellationToken);

                    // 9️⃣ **Trừ số lượng tồn kho sau khi đơn hàng đã được tạo**
                    foreach (var item in command.OrderItems)
                    {
                        var product = products.FirstOrDefault(p => p.ProductId == item.ProductId);
                        if (product != null)
                        {
                            product.Stocks -= item.Quantity;
                            _productRepository.Update(product);
                        }
                    }

                    // 🔟 Lưu tất cả thay đổi trong một transaction
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);

                    _logger.LogInformation("Order created successfully with OrderId: {OrderId}", newOrder.OrdId);

                    return Result.Success(new CreateOrderResponse
                    {
                        OrdId = newOrder.OrdId,
                        UsrId = newOrder.UsrId,
                        EventId = newOrder.EventId,
                        OrdDate = newOrder.OrdDate,
                        OrderStatus = Enum.GetName(typeof(OrderStatusEnum), newOrder.OrdStatusId) ?? "Unknown",
                        TotalOrdPrice = newOrder.TotalOrdPrice,
                        IsPaid = newOrder.IsPaid,
                        Items = command.OrderItems
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    _logger.LogError(ex, "Error occurred while creating order");
                    return Result.Failure<CreateOrderResponse>(new Error("OrderCreationFailed", ex.Message));
                }
            });
        }



    }

}