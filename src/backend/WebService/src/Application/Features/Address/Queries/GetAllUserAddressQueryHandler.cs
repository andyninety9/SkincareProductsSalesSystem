using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Address.Queries.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Address.Queries
{
    public sealed record GetAllUserAddressQuery(
        long UserId,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllUserAddressResponse>>;

    internal sealed class GetAllUserAddressQueryHandler : IQueryHandler<GetAllUserAddressQuery, PagedResult<GetAllUserAddressResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllUserAddressQueryHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public GetAllUserAddressQueryHandler(
            IAddressRepository addressRepository,
            IMapper mapper,
            ILogger<GetAllUserAddressQueryHandler> logger)
        {
            _addressRepository = addressRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllUserAddressResponse>>> Handle(GetAllUserAddressQuery request, CancellationToken cancellationToken)
        {
            try{
                var pageSize = request.PaginationParams.PageSize;
                var skip = (request.PaginationParams.Page - 1) * pageSize;

                var addresses = await _addressRepository.GetAllAddressByUserId(request.UserId);
                var pagedAddresses = addresses
                    .Skip(skip)
                    .Take(pageSize)
                    .ToList();
                List<GetAllUserAddressResponse> mappedAddresses = new();
                foreach (var address in pagedAddresses)
                {
                    mappedAddresses.Add(_mapper.Map<GetAllUserAddressResponse>(address));
                }

                return Result.Success(new PagedResult<GetAllUserAddressResponse>
            {
                Items = mappedAddresses,
                TotalItems = addresses.Count(),
                PageSize = pageSize,
                Page = request.PaginationParams.Page
            });            
           }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while fetching user addresses");
                return Result.Failure<PagedResult<GetAllUserAddressResponse>>(new Error("Address.GetAllFailed", "Error occurred while fetching user addresses"));
            }
        }

    }
}
