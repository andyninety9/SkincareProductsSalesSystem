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
    ///   "voucherDiscount": 20,
    ///   "usrId": "string",
    ///   "voucherDesc": "string",
    ///  "statusVoucher": "string",
    public sealed record ApplyVoucherCommand
    (
        long UsrId,
        string VoucherCode
    ) : ICommand<GetUserVoucherResponse>;
    

    internal sealed class ApplyVoucherCommandHandler : ICommandHandler<ApplyVoucherCommand, GetUserVoucherResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ApplyVoucherCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IVoucherRepository _voucherRepository;
        private readonly IUserRepository _userRepository;

        public ApplyVoucherCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ApplyVoucherCommandHandler> logger,
            IdGeneratorService idGenerator, IVoucherRepository voucherRepository,
            IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _voucherRepository = voucherRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }


        
        public async Task<Result<GetUserVoucherResponse>> Handle(ApplyVoucherCommand command, CancellationToken cancellationToken)
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

                if (voucher.UsrId != command.UsrId)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Invalid", "Voucher is not valid for this user"));
                }

                // voucher.StatusVoucher = false;

                // _voucherRepository.Update(voucher);
                // await _unitOfWork.CommitAsync(cancellationToken);

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
