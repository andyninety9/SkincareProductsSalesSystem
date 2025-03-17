using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Features.Users.Queries
{
    public sealed record GetUserVouchersQuery(
        long UserId,
        PaginationParams PaginationParams) : IQuery<PagedResult<GetUserVoucherResponse>>;
    internal sealed class GetUserVoucherQueryHandler : IQueryHandler<GetUserVouchersQuery, PagedResult<GetUserVoucherResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IVoucherRepository _voucherRepository;

        public GetUserVoucherQueryHandler(IUserRepository userRepository, IMapper mapper, IVoucherRepository voucherRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _voucherRepository = voucherRepository;
        }


        public async Task<Result<PagedResult<GetUserVoucherResponse>>> Handle(GetUserVouchersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
                if (user == null)
                {
                    return Result.Failure<PagedResult<GetUserVoucherResponse>>(new Error("Error", "User not found"));
                }

                var userVouchers = await _voucherRepository.GetVouchersByUserIdAsync(request.UserId, cancellationToken);

                List<GetUserVoucherResponse> listRespone = new();
                foreach (var voucher in userVouchers)
                {
                    var voucherResponse = _mapper.Map<GetUserVoucherResponse>(voucher);
                    listRespone.Add(voucherResponse);
                }

                var result = new PagedResult<GetUserVoucherResponse>
                {
                    Items = listRespone,
                    TotalItems = listRespone.Count,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };

                return Result.Success(result);
            }
            catch (Exception e)
            {
                return Result.Failure<PagedResult<GetUserVoucherResponse>>(new Error("Error", e.Message));
            }
            
        }

       
    }
}