using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace src.Controllers
{
    [ApiController]
    [Route("gateway-stats")]
    public class StatsController : ControllerBase
    {
        private readonly IDatabase _redisDb;
        private const string VisitorKey = "gateway_online_visitors";

        public StatsController(IConnectionMultiplexer redis)
        {
            _redisDb = redis.GetDatabase();
        }

        [HttpGet("online")]
        public async Task<IActionResult> GetOnlineVisitors()
        {
            // Tính số IP có truy cập trong 5 phút gần đây
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var since = DateTimeOffset.UtcNow.AddMinutes(-5).ToUnixTimeSeconds();

            var count = await _redisDb.SortedSetLengthAsync(VisitorKey, since, now);

            return Ok(new { onlineVisitors = count });
        }
    }
}