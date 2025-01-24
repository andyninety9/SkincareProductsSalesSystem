using Amazon.S3;
using Application.Abstractions.Cloud;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Application.Constant;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands
{
    public sealed record ChangeCoverCommand(
        long UsrId, byte[] CoverFileData, string FileName
    ) : ICommand;

    internal sealed class ChangeCoverCommandHandler : ICommandHandler<ChangeCoverCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudStorageService _cloudStorageService;
        private readonly ILogger<ChangeCoverCommandHandler> _logger;

        public ChangeCoverCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            ICloudStorageService cloudStorageService,
            ILogger<ChangeCoverCommandHandler> logger)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cloudStorageService = cloudStorageService;
            _logger = logger;
        }

        public async Task<Result> Handle(ChangeCoverCommand command, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting to handle ChangeCoverCommand for User ID: {UserId}", command.UsrId);

            // Finding user
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeCoverCommandHandler", IConstantMessage.USER_INFORMATION_NOT_FOUND));
            }

            _logger.LogInformation("User found: {UserId}, Current Avatar URL: {AvatarUrl}", user.UsrId, user.CoverUrl);

            // Process old avatar
            var oldCover = user.CoverUrl;

            if (command.CoverFileData == null || command.CoverFileData.Length == 0)
            {
                _logger.LogError("Avatar file data is null or empty for User ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeCoverCommandHandler", IConstantMessage.COVER_FILE_INVALID));
            }

            try
            {
                _logger.LogInformation("Cover file data length: {Length}", command.CoverFileData.Length);

                // Create new file path
                var folderName = "coverPhoto";
                var newFileName = $"{folderName}/{command.UsrId}/{Guid.NewGuid()}{Path.GetExtension(command.FileName)}";
                _logger.LogInformation("Generated new file path: {FilePath}", newFileName);

                // Upload file to S3
                string newCoverUrl;
                using (var memoryStream = new MemoryStream(command.CoverFileData))
                {
                    _logger.LogInformation("Uploading file for User ID: {UserId}", command.UsrId);
                    newCoverUrl = await _cloudStorageService.UploadFileAsync(memoryStream, "coverPhoto", command.UsrId.ToString(), newFileName, cancellationToken);
                }

                _logger.LogInformation("New Cover URL: {NewCover}", newCoverUrl);

                // Fetching user and updating avatar URL
                user.CoverUrl = newCoverUrl;
                _userRepository.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Delete old avatar
                if (!string.IsNullOrEmpty(oldCover))
                {
                    _logger.LogInformation("Deleting old avatar: {OldCover}", oldCover);
                    var bucketUrl = $"https://mavid-webapp.s3.ap-southeast-1.amazonaws.com/";
                    var fileKey = oldCover.Replace(bucketUrl, "");
                    await _cloudStorageService.DeleteFileAsync(fileKey, cancellationToken);
                }

                _logger.LogInformation("ChangeAvatarCommand handled successfully for User ID: {UserId}", command.UsrId);
                return Result.Success();
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "Amazon S3 error occurred while uploading file {FileName}. StatusCode: {StatusCode}, ErrorCode: {ErrorCode}", command.FileName, ex.StatusCode, ex.ErrorCode);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", IConstantMessage.FILE_UPLOAD_FALSE_ON_S3));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while handling ChangeAvatarCommand for User ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", IConstantMessage.INTERNAL_SERVER_ERROR));
            }
        }
    }
}
