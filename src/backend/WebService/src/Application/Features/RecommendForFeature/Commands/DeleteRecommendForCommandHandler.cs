using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.RecommendForFeature.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.RecommendForFeature.Commands
{
    public sealed record DeleteRecommendForCommand
    (
        string RecForId
    ) : ICommand<DeleteRecommendForResponse>;

    internal sealed class DeleteRecommendForCommandHandler : ICommandHandler<DeleteRecommendForCommand, DeleteRecommendForResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteRecommendForCommandHandler> _logger;
        private readonly IRecommendForRepository _recommendForRepository;



        public DeleteRecommendForCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteRecommendForCommandHandler> logger,
            IRecommendForRepository recommendForRepository)
        {
            _recommendForRepository = recommendForRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<DeleteRecommendForResponse>> Handle(DeleteRecommendForCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var recommendFor = await _recommendForRepository.GetByIdAsync(long.Parse(command.RecForId), cancellationToken);

                if (recommendFor == null)
                {
                    return Result<DeleteRecommendForResponse>.Failure<DeleteRecommendForResponse>(new Error("RecommendFor.DeleteError", "RecommendFor not found"));
                }

                await _recommendForRepository.DeleteByIdAsync(recommendFor.RecForId, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<DeleteRecommendForResponse>.Success(new DeleteRecommendForResponse
                {
                    RecForId = recommendFor.RecForId,
                    Message = "RecommendFor deleted successfully"
                });
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<DeleteRecommendForResponse>.Failure<DeleteRecommendForResponse>(new Error("ProductCategory.CreateError", e.Message));
            }
           
        }

    }
}
