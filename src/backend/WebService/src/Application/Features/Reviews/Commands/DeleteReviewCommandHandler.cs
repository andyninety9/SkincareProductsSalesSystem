using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Reviews.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Reviews.Commands
{
    public sealed record DeleteReviewCommand
    (
        long ReviewId
    ) : ICommand<DeleteReviewResponse>;

    internal sealed class DeleteReviewCommandHandler : ICommandHandler<DeleteReviewCommand, DeleteReviewResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteReviewCommandHandler> _logger;
        private readonly IReviewRepository _reviewRepository;

        public DeleteReviewCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteReviewCommandHandler> logger,
             IReviewRepository reviewRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _reviewRepository = reviewRepository;
        }

        public async Task<Result<DeleteReviewResponse>> Handle(DeleteReviewCommand command, CancellationToken cancellationToken)
        {
            try
            {
                Review review;
                try
                {
                    review = await _reviewRepository.GetByIdAsync(command.ReviewId, cancellationToken);
                    if (review == null)
                    {
                        return Result<DeleteReviewResponse>.Failure<DeleteReviewResponse>(new Error("Review", "Review not found"));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error retrieving review with ID {ReviewId}", command.ReviewId);
                    return Result<DeleteReviewResponse>.Failure<DeleteReviewResponse>(new Error("NotFound", "Review not found"));
                }
                await _reviewRepository.DeleteByIdAsync(review.ReviewId, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<DeleteReviewResponse>.Success(new DeleteReviewResponse
                {
                    ReviewId = review.ReviewId,
                    UserId = review.UsrId
                });
               
                
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return Result<DeleteReviewResponse>.Failure<DeleteReviewResponse>(new Error("Error", e.Message));
            }
           
        }

    }
}
