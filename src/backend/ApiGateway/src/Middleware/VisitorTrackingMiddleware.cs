using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace src.Middleware
{
    public class VisitorTrackingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IDatabase _redisDb;
        private const string VisitorKey = "gateway_online_visitors";

        public VisitorTrackingMiddleware(RequestDelegate next, IConnectionMultiplexer redis)
        {
            _next = next;
            _redisDb = redis.GetDatabase();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            // Ghi IP + thời gian vào Redis sorted set
            await _redisDb.SortedSetAddAsync(VisitorKey, ip, timestamp);

            // Dọn dẹp các IP quá cũ (quá 10 phút)
            var threshold = DateTimeOffset.UtcNow.AddMinutes(-10).ToUnixTimeSeconds();
            await _redisDb.SortedSetRemoveRangeByScoreAsync(VisitorKey, double.NegativeInfinity, threshold);

            await _next(context);
        }
    }
}