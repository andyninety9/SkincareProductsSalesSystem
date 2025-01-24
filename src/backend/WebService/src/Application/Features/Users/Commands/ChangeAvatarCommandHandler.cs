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

            // Tìm user
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", IConstantMessage.USER_INFORMATION_NOT_FOUND));
            }

            _logger.LogInformation("User found: {UserId}, Current Avatar URL: {AvatarUrl}", user.UsrId, user.AvatarUrl);

            // Xử lý avatar cũ
            var oldAvatar = user.AvatarUrl;

            if (command.AvatarFileData == null || command.AvatarFileData.Length == 0)
            {
                _logger.LogError("Avatar file data is null or empty for User ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", "Avatar file data is invalid."));
            }

            try
            {
                _logger.LogInformation("Avatar file data length: {Length}", command.AvatarFileData.Length);

                // Xây dựng đường dẫn lưu file trong bucket
                var folderName = "avatar";
                var newFileName = $"{folderName}/{command.UsrId}/{Guid.NewGuid()}{Path.GetExtension(command.FileName)}";
                _logger.LogInformation("Generated new file path: {FilePath}", newFileName);

                // Upload avatar mới
                string newAvatarUrl;
                using (var memoryStream = new MemoryStream(command.AvatarFileData))
                {
                    _logger.LogInformation("Uploading file for User ID: {UserId}", command.UsrId);
                    newAvatarUrl = await _cloudStorageService.UploadFileAsync(memoryStream, "avatar", command.UsrId.ToString(), newFileName, cancellationToken);
                }

                _logger.LogInformation("New Avatar URL: {NewAvatar}", newAvatarUrl);

                // Cập nhật avatar mới cho user
                user.AvatarUrl = newAvatarUrl;
                _userRepository.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Xóa avatar cũ nếu có
                if (!string.IsNullOrEmpty(oldAvatar))
                {
                    _logger.LogInformation("Deleting old avatar: {OldAvatar}", oldAvatar);
                    await _cloudStorageService.DeleteFileAsync(oldAvatar, cancellationToken);
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
                _logger.LogError(ex, "An unexpected error occurred while handling ChangeAvatarCommand for User ID: {UserId}", command.UsrId);
                return Result.Failure(new Error("ChangeAvatarCommandHandler", "An unexpected error occurred."));
            }
        }
    }
}
