using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Reviews.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Reviews.Commands
{
    public sealed record CreateReviewCommand
    (
        long UserId,
        string ReviewContent,
        double Rating,
        string ProdID
    ) : ICommand<CreateReviewResponse>;

    internal sealed class CreateReviewCommandHandler : ICommandHandler<CreateReviewCommand, CreateReviewResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateReviewCommandHandler> _logger;
        private readonly IReviewRepository _reviewRepository;
        private readonly IdGeneratorService _idGeneratorService;
        private readonly IProductRepository _productRepository;

        public CreateReviewCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateReviewCommandHandler> logger,
            IReviewRepository reviewRepository,
            IdGeneratorService idGeneratorService,
            IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _idGeneratorService = idGeneratorService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _reviewRepository = reviewRepository;
        }

        public async Task<Result<CreateReviewResponse>> Handle(CreateReviewCommand command, CancellationToken cancellationToken)
        {
            Review review = new Review
            {
                ReviewId = _idGeneratorService.GenerateLongId(),
                UsrId = command.UserId,
                ReviewContent = command.ReviewContent,
                Rating = command.Rating,
                ProdId = long.Parse(command.ProdID),
                UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
            };

            await _reviewRepository.AddAsync(review, cancellationToken);
            await _productRepository.UpdateRatingProductAsync(long.Parse(command.ProdID), command.Rating, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<CreateReviewResponse>.Success(_mapper.Map<CreateReviewResponse>(review));

        }

    }
}
