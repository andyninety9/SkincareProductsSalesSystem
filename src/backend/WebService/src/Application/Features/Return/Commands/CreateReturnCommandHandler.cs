using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Return.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace Application.Features.Return.Commands
{
    public sealed record CreateReturnCommand
    (
        long UserId,
        long OrdId,
        List<ReturnProductDto> ReturnProducts
    ) : ICommand<CreateReturnResponse>;

    internal sealed class CreateReturnCommandHandler : ICommandHandler<CreateReturnCommand, CreateReturnResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateReturnCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IReturnProductRepository _returnProductRepository;
        private readonly IReturnProductDetailRepository _returnProductDetailRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IOrderRepository _orderRepository;

        public CreateReturnCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateReturnCommandHandler> logger,
            IdGeneratorService idGenerator,
            IReturnProductRepository returnProductRepository,
            IReturnProductDetailRepository returnProductDetailRepository,
            IOrderDetailRepository orderDetailRepository,
            IOrderRepository orderRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _returnProductRepository = returnProductRepository;
            _returnProductDetailRepository = returnProductDetailRepository;
            _orderDetailRepository = orderDetailRepository;
            _orderRepository = orderRepository;
        }

        public async Task<Result<CreateReturnResponse>> Handle(CreateReturnCommand command, CancellationToken cancellationToken)
        {
            var strategy = _unitOfWork.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
                try
                {
                    _logger.LogInformation("Starting CreateReturnCommandHandler for OrderId: {OrdId}, UserId: {UserId}", command.OrdId, command.UserId);

                    // 1️⃣ Kiểm tra danh sách sản phẩm cần hoàn trả
                    if (command.ReturnProducts == null || !command.ReturnProducts.Any())
                    {
                        throw new ValidationException("At least one product must be returned.");
                    }

                    // 2️⃣ Kiểm tra đơn hàng có tồn tại không
                    Order? order;
                    try
                    {
                        order = await _orderRepository.GetByIdAsync(command.OrdId, cancellationToken);
                        if (order == null)
                        {
                            throw new KeyNotFoundException($"Order with ID {command.OrdId} was not found.");
                        }
                    }
                    catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
                    {
                        throw new KeyNotFoundException($"Order with ID {command.OrdId} does not exist in the system.", ex);
                    }

                    // 3️⃣ Kiểm tra quyền truy cập (UserId phải khớp với chủ sở hữu đơn hàng)
                    if (order.UsrId != command.UserId)
                    {
                        throw new UnauthorizedAccessException("You are not authorized to return this order.");
                    }

                    // 4️⃣ Lấy giá sản phẩm trong đơn hàng để tính tiền hoàn lại
                    var productIds = command.ReturnProducts.Select(p => p.ProductId).ToList();
                    var productPrices = await _orderDetailRepository.GetProductPrices(productIds, command.OrdId, cancellationToken);

                    double refundAmount = 0;

                    // 5️⃣ Kiểm tra từng sản phẩm có thể hoàn trả không
                    foreach (var returnProductDto in command.ReturnProducts)
                    {
                        if (!productPrices.TryGetValue(returnProductDto.ProductId, out double productPrice))
                        {
                            throw new KeyNotFoundException($"Product {returnProductDto.ProductId} is not found in the order.");
                        }

                        refundAmount += productPrice * returnProductDto.Quantity;
                    }

                    // 6️⃣ Tạo yêu cầu hoàn trả
                    var returnProduct = new ReturnProduct
                    {
                        ReturnId = _idGenerator.GenerateLongId(),
                        OrdIdd = command.OrdId,
                        UsrId = command.UserId,
                        ReturnDate = DateOnly.FromDateTime(DateTime.UtcNow),
                        ReturnStatus = false,
                        RefundAmount = refundAmount
                    };

                    await _returnProductRepository.AddAsync(returnProduct, cancellationToken);

                    // 7️⃣ Tạo chi tiết hoàn trả sản phẩm
                    var returnProductDetails = command.ReturnProducts.Select(item => new ReturnProductDetail
                    {
                        ReturnProdDetailId = _idGenerator.GenerateLongId(),
                        ProdIdre = item.ProductId,
                        ReturnId = returnProduct.ReturnId,
                        ReturnQuantity = item.Quantity,
                        ReturnImgUrl = string.Empty,
                    }).ToList();

                    await _returnProductDetailRepository.AddRangeAsync(returnProductDetails, cancellationToken);

                    // 🔟 Lưu tất cả thay đổi trong một transaction
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);

                    _logger.LogInformation("Return request successfully created with ReturnId: {ReturnId}", returnProduct.ReturnId);

                    return Result.Success(new CreateReturnResponse
                    {
                        ReturnId = returnProduct.ReturnId,
                        OrdId = returnProduct.OrdIdd,
                        UserId = returnProduct.UsrId,
                        TotalRefund = returnProduct.RefundAmount,
                        CreatedAt = DateTime.UtcNow,
                        ReturnProducts = command.ReturnProducts
                    });
                }
                catch (KeyNotFoundException ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    _logger.LogError(ex, "Order not found: {OrdId}", command.OrdId);
                    return Result.Failure<CreateReturnResponse>(new Error("OrderNotFound", ex.Message));
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    _logger.LogError(ex, "Error occurred while creating return for OrderId: {OrdId}", command.OrdId);
                    return Result.Failure<CreateReturnResponse>(new Error("ReturnCreationError", ex.Message));
                }
            });
        }

    }
}
