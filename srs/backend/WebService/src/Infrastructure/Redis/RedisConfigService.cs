using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Redis
{
    public class RedisConfigService
    {
        public string RedisHost { get; set; }

        public string RedisUsername { get; set; }
        public int RedisPort { get; set; }
        public string RedisPassword { get; set; }

        public RedisConfigService()
        {
            RedisHost = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
            RedisPort = int.Parse(Environment.GetEnvironmentVariable("REDIS_PORT") ?? "6379");
            RedisPassword = Environment.GetEnvironmentVariable("REDIS_PASSWORD") ?? "password";
            RedisUsername = Environment.GetEnvironmentVariable("REDIS_USERNAME") ?? "username";
        }
    }
}