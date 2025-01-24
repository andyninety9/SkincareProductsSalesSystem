using System;

namespace Infrastructure.Cloud
{
    public class AwsS3Config
    {
        public string BucketName { get; }
        public string AccessKey { get; }
        public string SecretKey { get; }
        public string Region { get; }

        public AwsS3Config()
        {
            BucketName = GetEnvironmentVariable("AWS_BUCKET_NAME_S3");
            AccessKey = GetEnvironmentVariable("AWS_ACCESS_KEY_S3");
            SecretKey = GetEnvironmentVariable("AWS_SECRET_KEY_S3");
            Region = GetEnvironmentVariable("AWS_REGION_S3");
        }

        private string GetEnvironmentVariable(string variableName)
        {
            var value = Environment.GetEnvironmentVariable(variableName);
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"Environment variable '{variableName}' is not set.");
            }
            return value;
        }
    }
}