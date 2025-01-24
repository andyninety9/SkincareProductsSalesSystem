using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Application.Abstractions.Cloud;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Cloud
{
    public class CloudStorageService : ICloudStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly AwsS3Config _awsConfig;
        private readonly ILogger<CloudStorageService> _logger;

        public CloudStorageService(IAmazonS3 s3Client, AwsS3Config awsConfig, ILogger<CloudStorageService> logger)
        {
            _s3Client = s3Client;
            _awsConfig = awsConfig;
            _logger = logger;
        }

        public async Task DeleteFileAsync(string filePath, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogDebug("Preparing to delete file...");
                _logger.LogDebug("Bucket Name: {BucketName}", _awsConfig.BucketName);
                _logger.LogDebug("File Key (Path): {FilePath}", filePath);

                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _awsConfig.BucketName,
                    Key = filePath
                };

                _logger.LogDebug("Delete Request: {DeleteRequest}", deleteRequest);

                var response = await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);

                _logger.LogDebug("Delete Response: {Response}", response);
                _logger.LogInformation("File {FilePath} deleted successfully from bucket {BucketName}", filePath, _awsConfig.BucketName);
            }
            catch (AmazonS3Exception s3Ex)
            {
                _logger.LogError(s3Ex, "Amazon S3 error occurred while deleting file {FilePath} from bucket {BucketName}. StatusCode: {StatusCode}, ErrorCode: {ErrorCode}",
                    filePath, _awsConfig.BucketName, s3Ex.StatusCode, s3Ex.ErrorCode);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while deleting file {FilePath} from bucket {BucketName}", filePath, _awsConfig.BucketName);
                throw;
            }
        }


        public string GetFileUrl(string filePath)
        {
            _logger.LogInformation("Generating URL for file {FilePath}", filePath);
            return $"https://{_awsConfig.BucketName}.s3.{_awsConfig.Region}.amazonaws.com/{filePath}";
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string folderName, string id, string fileName, CancellationToken cancellationToken)
        {
            try
            {
                // Xây dựng đường dẫn key theo thư mục và id
                var filePath = $"{fileName}";

                _logger.LogInformation("Uploading file {FileName} to bucket {BucketName} in path {FilePath}", fileName, _awsConfig.BucketName, filePath);

                var putRequest = new PutObjectRequest
                {
                    BucketName = _awsConfig.BucketName,
                    Key = filePath,
                    InputStream = fileStream,
                    ContentType = GetContentType(fileName),
                    CannedACL = S3CannedACL.PublicRead // Đặt quyền public để file có thể được truy cập qua URL
                };

                await _s3Client.PutObjectAsync(putRequest, cancellationToken);

                _logger.LogInformation("File {FileName} uploaded successfully to bucket {BucketName} in path {FilePath}", fileName, _awsConfig.BucketName, filePath);

                // Trả về URL công khai
                return GetFileUrl(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading file {FileName} to bucket {BucketName}", fileName, _awsConfig.BucketName);
                throw;
            }
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLower();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };
        }
    }
}
