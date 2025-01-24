using Amazon.S3;
using Application.Abstractions.Cloud;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Constant;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands
{
    public sealed record ChangeAvatarCommand(
        long UsrId, byte[] AvatarFileData, string FileName
    ) : ICommand;

    internal sealed class ChangeAvatarCommandHandler : ICommandHandler<ChangeAvatarCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudStorageService _cloudStorageService;
        private readonly ILogger<ChangeAvatarCommandHandler> _logger;

        public ChangeAvatarCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            ICloudStorageService cloudStorageService,
            ILogger<ChangeAvatarCommandHandler> logger)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cloudStorageService = cloudStorageService;
            _logger = logger;
        }

        public async Task<Result> Handle(ChangeAvatarCommand command, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting to handle ChangeAvatarCommand for User ID: {UserId}", command.UsrId);

            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", IConstantMessage.USER_INFORMATION_NOT_FOUND));
            }

            _logger.LogInformation("User found: {UserId}, Current Avatar URL: {AvatarUrl}", user.UsrId, user.AvatarUrl);

            var oldAvatar = user.AvatarUrl;
            _logger.LogInformation("Old Avatar URL: {OldAvatar}", oldAvatar);

            try
            {
                // Check if AvatarFileData is valid
                if (command.AvatarFileData == null || command.AvatarFileData.Length == 0)
                {
                    _logger.LogError("Avatar file data is null or empty for User ID: {UserId}", command.UsrId);
                    return Result.Failure(new Error("ChangeAvatarCommandHandler", "Avatar file data is invalid."));
                }

                _logger.LogInformation("Avatar file data length: {Length}", command.AvatarFileData.Length);

                // Upload new avatar
                _logger.LogInformation("Uploading new avatar for User ID: {UserId}", command.UsrId);
                using (var memoryStream = new MemoryStream(command.AvatarFileData))
                {
                    _logger.LogInformation("File stream length: {Length}", memoryStream.Length);
                    var newAvatar = await _cloudStorageService.UploadFileAsync(memoryStream, command.FileName, cancellationToken);
                    _logger.LogInformation("New Avatar URL: {NewAvatar}", newAvatar);

                    // Update user's avatar URL
                    user.AvatarUrl = newAvatar;
                    _userRepository.Update(user);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Avatar URL updated successfully for User ID: {UserId}", command.UsrId);
                }

                // Delete old avatar if it exists
                if (!string.IsNullOrEmpty(oldAvatar))
                {
                    _logger.LogInformation("Deleting old avatar: {OldAvatar}", oldAvatar);
                    await _cloudStorageService.DeleteFileAsync(oldAvatar, cancellationToken);
                    _logger.LogInformation("Old avatar deleted successfully: {OldAvatar}", oldAvatar);
                }

                _logger.LogInformation("ChangeAvatarCommand handled successfully for User ID: {UserId}", command.UsrId);
                return Result.Success();
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "Amazon S3 error occurred while uploading file {FileName}. StatusCode: {StatusCode}, ErrorCode: {ErrorCode}", command.FileName, ex.StatusCode, ex.ErrorCode);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", "Failed to upload avatar due to S3 error."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while handling ChangeAvatarCommand for User ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", "An unexpected error occurred."));
            }
        }
    }
}