using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Return.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Return.Commands
{
    public sealed record ProcessReturnCommand
    (
        string ReturnId,
        bool Status
    ) : ICommand<ProcessReturnResponse>;

    internal sealed class ProcessReturnCommandHandler : ICommandHandler<ProcessReturnCommand, ProcessReturnResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ProcessReturnCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IReturnProductRepository _returnProductRepository;

        public ProcessReturnCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ProcessReturnCommandHandler> logger,
            IdGeneratorService idGenerator, IReturnProductRepository returnProductRepository)
        {
            _returnProductRepository = returnProductRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<ProcessReturnResponse>> Handle(ProcessReturnCommand command, CancellationToken cancellationToken)
        {
            try
            {
                long.TryParse(command.ReturnId, out var returnId);
                var returnProduct = await _returnProductRepository.GetByIdAsync(returnId, cancellationToken);
                if (returnProduct == null)
                {
                    return Result<ProcessReturnResponse>.Failure<ProcessReturnResponse>(new Error("ReturnProduct.NotFound", "Return product not found"));
                }

                returnProduct.ReturnStatus = command.Status;
                _returnProductRepository.Update(returnProduct);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<ProcessReturnResponse>.Success<ProcessReturnResponse>(new ProcessReturnResponse
                {
                    ReturnId = returnProduct.ReturnId,
                    Message = "Return request processed successfully"
                });
               
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<ProcessReturnResponse>.Failure<ProcessReturnResponse>(new Error("ProductCategory.CreateError", e.Message));
            }
           
        }

    }
}
