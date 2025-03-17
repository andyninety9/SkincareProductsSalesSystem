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
    public sealed record AssignVoucherCommand
    (
        string VoucherDesc,
        bool StatusVoucher,
        double VoucherDiscount,
        string UsrId
    ) : ICommand<GetUserVoucherResponse>;
    

    internal sealed class AssignVoucherCommandHandler : ICommandHandler<AssignVoucherCommand, GetUserVoucherResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<AssignVoucherCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IVoucherRepository _voucherRepository;
        private readonly IUserRepository _userRepository;

        public AssignVoucherCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<AssignVoucherCommandHandler> logger,
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


        private string GenerateVoucherCode()
        {
            // Create a random number generator
            Random random = new Random();

            // Generate a random 6-digit number
            int randomNumber = random.Next(100000, 1000000);

            // Format the voucher code
            return $"MAVID-{randomNumber}";
        }
        public async Task<Result<GetUserVoucherResponse>> Handle(AssignVoucherCommand command, CancellationToken cancellationToken)
        {
            try
            {
                if (!long.TryParse(command.UsrId, out var usrId))
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Create", "Cannot create voucher"));
                }
                var user = await _userRepository.GetByIdAsync(usrId, cancellationToken);
                if (user == null)
                {
                    return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Create", "User not found"));
                }

                Voucher newVoucher = new()
                {
                    VoucherCode = GenerateVoucherCode(),
                    VoucherId = _idGenerator.GenerateLongId(),
                    VoucherDesc = command.VoucherDesc,
                    StatusVoucher = command.StatusVoucher,
                    VoucherDiscount = command.VoucherDiscount,
                    UsrId = usrId
                };

                await _voucherRepository.AddAsync(newVoucher, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                

                return Result<GetUserVoucherResponse>.Success(_mapper.Map<GetUserVoucherResponse>(newVoucher));


            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<GetUserVoucherResponse>.Failure<GetUserVoucherResponse>(new Error("Voucher.Create", e.Message));
            }

        }

    }
}
