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
    public sealed record CreateRecommendForCommand
    (
        string ProdId,
        string SkinTypeId
    ) : ICommand<CreateRecommendForResponse>;

    internal sealed class CreateRecommendForCommandHandler : ICommandHandler<CreateRecommendForCommand, CreateRecommendForResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateRecommendForCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IRecommendForRepository _recommendForRepository;



        public CreateRecommendForCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateRecommendForCommandHandler> logger,
            IdGeneratorService idGenerator, IRecommendForRepository recommendForRepository)
        {
            _recommendForRepository = recommendForRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<CreateRecommendForResponse>> Handle(CreateRecommendForCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var recommendFor = new RecommendFor
                {
                    RecForId = _idGenerator.GenerateLongId(),
                    ProdId = long.Parse(command.ProdId),
                    SkinTypeId = short.Parse(command.SkinTypeId)
                };

                bool isExist = await _recommendForRepository.IsExistAsync(recommendFor, cancellationToken);

                if (isExist)
                {
                    return Result<CreateRecommendForResponse>.Failure<CreateRecommendForResponse>(new Error("RecommendFor.CreateError", "RecommendFor already exists"));
                }

                await _recommendForRepository.AddAsync(recommendFor, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateRecommendForResponse>.Success(_mapper.Map<CreateRecommendForResponse>(recommendFor));

                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<CreateRecommendForResponse>.Failure<CreateRecommendForResponse>(new Error("ProductCategory.CreateError", e.Message));
            }
           
        }

    }
}
