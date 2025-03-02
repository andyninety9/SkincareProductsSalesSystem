using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Enum;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Users.Queries
{
    public sealed record GetUserVouchersQuery(long UserId) : IQuery<GetUserVoucherResponse>;
    internal sealed class GetUserVoucherQueryHandler : IQueryHandler<GetUserVouchersQuery, GetUserVoucherResponse>
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


        public async Task<Result<GetUserVoucherResponse>> Handle(GetUserVouchersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
                if (user == null)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Error", "User not found"));
                }

                List<Voucher> userVouchers = await _voucherRepository.GetVouchersByUserIdAsync(request.UserId, cancellationToken);

                var response = new GetUserVoucherResponse
                {
                    UsrId = user.UsrId,
                    VoucherId = userVouchers.First().VoucherId,
                    VoucherDiscount = userVouchers.First().VoucherDiscount,
                    VoucherDesc = userVouchers.First().VoucherDesc,
                    VoucherCode = userVouchers.First().VoucherCode,
                    StatusVoucher = userVouchers.First().StatusVoucher
                };

                
                return Result<GetUserVoucherResponse>.Success(response);
            }
            catch (Exception e)
            {
                return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Error", e.Message));
            }
            
        }

       
    }
}