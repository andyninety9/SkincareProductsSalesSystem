using Application.Abstractions.Redis;
using StackExchange.Redis;
using RedisDatabase = StackExchange.Redis.IDatabase;

namespace Infrastructure.Redis
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly RedisDatabase _database;

        public RedisCacheService(IConnectionMultiplexer connectionMultiplexer)
        {
            _database = connectionMultiplexer.GetDatabase();
        }

        public async Task<string> GetAsync(string key)
        {
            var value = await _database.StringGetAsync(key);
            return value.HasValue ? value.ToString() : string.Empty;
        }

        public async Task SetAsync(string key, string value, TimeSpan expiration)
        {
            await _database.StringSetAsync(key, value, expiration);
        }

        public async Task RemoveAsync(string key)
        {
            await _database.KeyDeleteAsync(key);
        }
    }
}