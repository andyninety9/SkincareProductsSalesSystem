using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Return.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Return.Queries
{
    public sealed record GetAllReturnByCustomerCommand(
        long UserId,
        long? OrderId,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllReturnByCustomerResponse>>;

    internal sealed class GetAllReturnByCustomerCategoryQueryHandler : IQueryHandler<GetAllReturnByCustomerCommand, PagedResult<GetAllReturnByCustomerResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllReturnByCustomerCategoryQueryHandler> _logger;
        private readonly IReturnProductRepository _returnProductRepository;
        private readonly IReturnProductDetailRepository _returnProductDetailRepository;
        private readonly IOrderLogRepository _orderLogRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductImageRepository _productImageRepository;

        public GetAllReturnByCustomerCategoryQueryHandler(
            IMapper mapper,
            ILogger<GetAllReturnByCustomerCategoryQueryHandler> logger, IReturnProductRepository returnProductRepository, IReturnProductDetailRepository returnProductDetailRepository, IOrderLogRepository orderLogRepository,
            IProductRepository productRepository,
            IProductImageRepository productImageRepository)
        {
            _mapper = mapper;
            _logger = logger;
            _returnProductRepository = returnProductRepository;
            _returnProductDetailRepository = returnProductDetailRepository;
            _orderLogRepository = orderLogRepository;
            _productRepository = productRepository;
            _productImageRepository = productImageRepository;
        }

        public async Task<Result<PagedResult<GetAllReturnByCustomerResponse>>> Handle(GetAllReturnByCustomerCommand request, CancellationToken cancellationToken)
        {
            var listReturn = await _returnProductRepository.GetAllAsync(cancellationToken);
            var listReturnDetail = await _returnProductDetailRepository.GetAllAsync(cancellationToken);
            var listOrderLog = await _orderLogRepository.GetAllAsync(cancellationToken);
            var listProduct = await _productRepository.GetAllAsync(cancellationToken);
            var listProductImage = await _productImageRepository.GetAllAsync(cancellationToken);

            int totalItems = listReturn.Count();

            var query = listReturn
                .Where(r => listOrderLog.Any(ol => ol.OrdId == r.OrdIdd && ol.UsrId == request.UserId &&
                            (request.OrderId == null || r.OrdIdd.ToString().Contains(request.OrderId.ToString()))))
                .GroupBy(r => r.ReturnId)
                .Select(group => new GetAllReturnByCustomerResponse
                {
                    ReturnId = group.Key,
                    OrderId = group.First().OrdIdd,
                    ReturnDate = group.First().ReturnDate,
                    ReturnReason = listOrderLog.FirstOrDefault(ol => ol.OrdId == group.First().OrdIdd)?.Note ?? string.Empty,
                    RefundAmount = group.First().RefundAmount,
                    ReturnStatus = group.First().ReturnStatus,
                    TotalItems = totalItems,

                    // ✅ Chỉ lấy danh sách sản phẩm tương ứng với từng ReturnId
                    ReturnProductDetails = listReturnDetail
                        .Where(rd => rd.ReturnId == group.Key)
                        .Select(rd => new ReturnProductDetailDto
                        {
                            ProductId = rd.ProdIdre,
                            ProductName = listProduct.FirstOrDefault(p => p.ProductId == rd.ProdIdre)?.ProductName ?? string.Empty,
                            ProductImage = listProductImage.FirstOrDefault(pi => pi.ProdId == rd.ProdIdre)?.ProdImageUrl ?? string.Empty,
                            SellPrice = listProduct.FirstOrDefault(p => p.ProductId == rd.ProdIdre)?.SellPrice ?? 0,
                            Quantity = rd.ReturnQuantity
                        })
                        .ToList()
                }).ToList();

            var pagedItems = new PagedResult<GetAllReturnByCustomerResponse>
            {
                Items = query.Skip((request.PaginationParams.Page - 1) * request.PaginationParams.PageSize)
                             .Take(request.PaginationParams.PageSize)
                             .ToList(),
                TotalItems = query.Count(),
                Page = request.PaginationParams.Page,
                PageSize = request.PaginationParams.PageSize
            };

            return Result<PagedResult<GetAllReturnByCustomerResponse>>.Success(pagedItems);
        }


    }
}
