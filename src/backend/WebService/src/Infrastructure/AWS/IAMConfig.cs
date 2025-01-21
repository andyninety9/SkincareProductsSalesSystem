using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.AWS
{
    public class IAMConfig
    {
       
        public string? AccessKey { get; set; } 
        public string? SecretKey { get; set; }
        public string? Region { get; set; }

        public IAMConfig()
        {
            AccessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
            SecretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
            Region = Environment.GetEnvironmentVariable("AWS_REGION");
        }

    }
}