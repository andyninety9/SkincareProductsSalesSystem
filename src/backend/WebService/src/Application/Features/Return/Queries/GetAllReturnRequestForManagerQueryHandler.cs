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

        public GetAllReturnRequestForManagerQueryHandler(
            IReturnProductRepository returnProductRepository,
            IUserRepository userRepository,
            IReturnProductDetailRepository returnProductDetailRepository,
            IMapper mapper,
            ILogger<GetAllReturnRequestForManagerQueryHandler> logger)
        {
            _userRepository = userRepository;
            _returnProductRepository = returnProductRepository;
            _returnProductDetailRepository = returnProductDetailRepository;
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
                                returnRequest.ReturnProducts.Add(_mapper.Map<ReturnProductDetailDto>(detail));
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
