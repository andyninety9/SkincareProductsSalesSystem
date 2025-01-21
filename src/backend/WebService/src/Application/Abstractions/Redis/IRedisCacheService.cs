using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Abstractions.Redis
{
    public interface IRedisCacheService
    {
        Task<string> GetAsync(string key);
        Task SetAsync(string key, string value, TimeSpan expiration);
        Task RemoveAsync(string key);
    }
}