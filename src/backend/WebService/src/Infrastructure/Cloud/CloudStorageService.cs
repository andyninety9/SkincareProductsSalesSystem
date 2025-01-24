using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

        public async Task DeleteFileAsync(string fileName, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Deleting file {FileName} from bucket {BucketName}", fileName, _awsConfig.BucketName);

                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _awsConfig.BucketName,
                    Key = fileName
                };

                await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);

                _logger.LogInformation("File {FileName} deleted successfully from bucket {BucketName}", fileName, _awsConfig.BucketName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting file {FileName} from bucket {BucketName}", fileName, _awsConfig.BucketName);
                throw;
            }
        }

        public string GetFileUrl(string fileName)
        {
            _logger.LogInformation("Generating URL for file {FileName}", fileName);
            return $"https://{_awsConfig.BucketName}.s3.{_awsConfig.Region}.amazonaws.com/{fileName}";
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Uploading file {FileName} to bucket {BucketName}", fileName, _awsConfig.BucketName);

                var putRequest = new PutObjectRequest
                {
                    BucketName = _awsConfig.BucketName,
                    Key = fileName,
                    InputStream = fileStream,
                    ContentType = GetContentType(fileName),
                    CannedACL = S3CannedACL.PublicRead // Đặt quyền public để file có thể được truy cập qua URL
                };

                var response = await _s3Client.PutObjectAsync(putRequest, cancellationToken);

                _logger.LogInformation("File {FileName} uploaded successfully to bucket {BucketName}", fileName, _awsConfig.BucketName);

                return GetFileUrl(fileName);
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
