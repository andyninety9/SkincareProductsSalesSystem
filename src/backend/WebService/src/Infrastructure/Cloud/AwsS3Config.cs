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
            BucketName = GetEnvironmentVariable("AWS_BUCKET_NAME");
            AccessKey = GetEnvironmentVariable("AWS_ACCESS_KEY");
            SecretKey = GetEnvironmentVariable("AWS_SECRET_KEY");
            Region = GetEnvironmentVariable("AWS_REGION");
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