using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Queries.Response;
using Application.Features.Return.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Return.Queries
{
    public sealed record GetAllReturnRequestQueryManager(
            string? Keyword,
            PaginationParams PaginationParams
            ) : IQuery<PagedResult<GetAllReturnRequestByManagerDto>>;

    internal sealed class GetAllReturnRequestForManagerQueryHandler : IQueryHandler<GetAllReturnRequestQueryManager, PagedResult<GetAllReturnRequestByManagerDto>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllReturnRequestForManagerQueryHandler> _logger;
        private readonly IReturnProductRepository _returnProductRepository;

        private readonly IUserRepository _userRepository;
        private readonly IReturnProductDetailRepository _returnProductDetailRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductImageRepository _productImageRepository;

        public GetAllReturnRequestForManagerQueryHandler(
            IProductRepository productRepository,
            IReturnProductRepository returnProductRepository,
            IUserRepository userRepository,
            IReturnProductDetailRepository returnProductDetailRepository,
            IProductImageRepository productImageRepository,
            IMapper mapper,
            ILogger<GetAllReturnRequestForManagerQueryHandler> logger)
        {
            _userRepository = userRepository;
            _returnProductRepository = returnProductRepository;
            _returnProductDetailRepository = returnProductDetailRepository;
            _productRepository = productRepository;
            _productImageRepository = productImageRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllReturnRequestByManagerDto>>> Handle(GetAllReturnRequestQueryManager request, CancellationToken cancellationToken)
        {
            try
            {
                List<GetAllReturnRequestByManagerDto> returnRequests = new List<GetAllReturnRequestByManagerDto>();
                var listAllReturn = await _returnProductRepository.GetAllAsync(cancellationToken);
                if (listAllReturn != null)
                {
                    foreach (var item in listAllReturn)
                    {
                        GetAllReturnRequestByManagerDto returnRequest = new GetAllReturnRequestByManagerDto();
                        returnRequest.ReturnId = item.ReturnId;
                        returnRequest.OrdIdd = item.OrdIdd;
                        returnRequest.ReturnDate = item.ReturnDate;
                        returnRequest.RefundAmount = item.RefundAmount;
                        returnRequest.ReturnStatus = item.ReturnStatus;
                        returnRequest.User = _mapper.Map<UserDto>(await _userRepository.GetByIdAsync(item.UsrId, cancellationToken));
                        var listReturnDetail = await _returnProductDetailRepository.GetByReturnIdAsync(item.ReturnId, cancellationToken);

                        if (listReturnDetail != null)
                        {
                            foreach (var detail in listReturnDetail)
                            {
                                long productId = detail.ProdIdre;
                                var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
                                ReturnProductDetailDto tmp = new ReturnProductDetailDto();
                                tmp = _mapper.Map<ReturnProductDetailDto>(product);
                                tmp.Quantity = detail.ReturnQuantity;
                                var productImage = await _productImageRepository.GetImagesByProductIdAsync(productId, cancellationToken);
                                if (productImage != null && productImage.Any())
                                {
                                    tmp.ProductImage = productImage.First().ProdImageUrl;

                                }
                                else
                                {
                                    tmp.ProductImage = "https://image.cocoonvietnam.com/uploads/z5322301407365_da64ee4ef34e8f8c85194a8b3967f354_db4782bf9d.jpg";
                                }

                                returnRequest.ReturnProducts.Add(tmp);
                               
                            }
                        }
                        returnRequests.Add(returnRequest);
                    }

                    if(request.Keyword != null)
                    {
                        long returnId = long.TryParse(request.Keyword, out returnId) ? returnId : 0;
                        returnRequests = returnRequests.Where(x => x.ReturnId == returnId).ToList();
                    }

                    return Result.Success(new PagedResult<GetAllReturnRequestByManagerDto>
                    {
                        Items = returnRequests,
                        Page = request.PaginationParams.Page,
                        PageSize = request.PaginationParams.PageSize,
                        TotalItems = returnRequests.Count
                    });
                }
                return Result.Failure<PagedResult<GetAllReturnRequestByManagerDto>>(new Error("Error", "No data found"));                
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return Result.Failure<PagedResult<GetAllReturnRequestByManagerDto>>(new Error("Error", e.Message));
            }
        }

    }
}
