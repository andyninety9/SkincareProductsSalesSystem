using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class UserRepository :  Repository<User>, IUserRepository
    {
        private readonly ILogger<UserRepository> _logger;
        public UserRepository(MyDbContext context, ILogger<UserRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<ActiveUserCountDto> GetActiveUserCountAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            try
            {
                int activeUserCount = await _context.Orders
                    .Where(o => o.CreatedAt >= fromDate && o.CreatedAt <= toDate)
                    .Select(o => o.UsrId)
                    .Distinct()
                    .CountAsync(cancellationToken);

                return new ActiveUserCountDto { ActiveUserCount = activeUserCount };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting active user count between {FromDate} and {ToDate}", fromDate, toDate);
                throw;
            }
        }

        public IQueryable<User> GetAllUsers()
        {
            return _context.Users.AsNoTracking().Include(user => user.Usr); ;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            try
            {
                // Sử dụng FirstOrDefaultAsync để trả về null nếu không tìm thấy user
                return await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching user by email: {Email}", email);
                throw; // Ném ngoại lệ nếu có lỗi truy vấn cơ sở dữ liệu
            }
        }


        public Task<string> GetEmailVerifyTokenByUsrID(long usrId)
        {
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == usrId);
            return Task.FromResult(user?.EmailVerifyToken ?? string.Empty);
            
        }

        public Task<NewUserCountDto> GetNewUserCountAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            var newUserCount = _context.Users.Count(u => u.CreatedAt >= fromDate && u.CreatedAt <= toDate);
            return Task.FromResult(new NewUserCountDto { NewUserCount = newUserCount });
        }

        public Task<ListTopSpendingUserDto> GetTopSpendingUsersAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            try
            {
                var topSpendingUsers = _context.Users
                    .Join(
                        _context.Orders,
                        user => user.UsrId,
                        order => order.UsrId,
                        (user, order) => new { User = user, Order = order }
                    )
                    .Where(joined =>
                        joined.Order.CreatedAt >= fromDate &&
                        joined.Order.CreatedAt <= toDate &&
                        joined.Order.OrdStatusId > 0 &&
                        joined.Order.IsPaid == true)
                    .GroupBy(joined => new { joined.User.UsrId, joined.User.Fullname })
                    .Select(group => new GetTopSpendingUsersDto
                    {
                        UserId = group.Key.UsrId,
                        UserName = group.Key.Fullname ?? "Unknown",
                        OrderCount = group.Count(),
                        TotalSpent = group.Sum(item => item.Order.TotalOrdPrice),
                        AvgOrderValue = Math.Round(
                            group.Sum(item => item.Order.TotalOrdPrice) / group.Count(),
                            2)
                    })
                    .OrderByDescending(dto => dto.TotalSpent)
                    .Take(10)
                    .ToList();

                return Task.FromResult(new ListTopSpendingUserDto
                {
                    TopSpendingUsers = topSpendingUsers
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting top spending users between {FromDate} and {ToDate}", fromDate, toDate);
                throw;
            }
        }

        public Task<TotalUserDto> GetTotalUserAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            var totalUser = _context.Users.Count(u => u.CreatedAt >= fromDate && u.CreatedAt <= toDate);
            return Task.FromResult(new TotalUserDto { TotalUser = totalUser });
        }

        public Task<User> GetUserByAccountId(long accountId)
        {
            
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == accountId);
            if (user == null)
                throw new KeyNotFoundException($"User with account ID {accountId} not found.");
            return Task.FromResult(user);
        }

        public async Task<UserByAgeGroupDto> GetUserByAgeGroupAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Get current date for age calculation
                DateOnly today = DateOnly.FromDateTime(DateTime.Today);

                // Dictionary to store age group counts
                var ageGroups = new Dictionary<string, int>
        {
            { "18-24", 0 },
            { "25-34", 0 },
            { "35-44", 0 },
            { "45-54", 0 },
            { "55+", 0 },
            { "Unknown", 0 }
        };

                // Get users with non-null DOB
                var users = await _context.Users
                    .Where(u => u.Dob != null)
                    .Select(u => u.Dob)
                    .ToListAsync(cancellationToken);

                foreach (var dob in users)
                {
                    if (dob == null) continue;

                    // Calculate age
                    int age = today.Year - dob.Value.Year;

                    // Adjust age if birthday hasn't occurred yet this year
                    if (dob.Value.Month > today.Month || (dob.Value.Month == today.Month && dob.Value.Day > today.Day))
                    {
                        age--;
                    }

                    // Assign to proper age group
                    string ageGroup;
                    if (age < 18)
                        ageGroup = "Unknown";
                    else if (age <= 24)
                        ageGroup = "18-24";
                    else if (age <= 34)
                        ageGroup = "25-34";
                    else if (age <= 44)
                        ageGroup = "35-44";
                    else if (age <= 54)
                        ageGroup = "45-54";
                    else
                        ageGroup = "55+";

                    ageGroups[ageGroup]++;
                }

                // Create and return the DTO with age group data
                return new UserByAgeGroupDto
                {
                    AgeGroups = ageGroups
                        .Select(g => new AgeGroupCount { AgeGroup = g.Key, Count = g.Value })
                        .OrderBy(g => g.AgeGroup == "Unknown" ? "Z" : g.AgeGroup) // Order by age group, with "Unknown" at the end
                        .ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting user count by age group");
                throw;
            }
        }

        public async Task<ListUserByLocationDto> GetUserByLocationAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            try
            {
                var usersByLocation = await _context.Addresses
                    .Where(a => a.IsDefault)
                    .Join(
                        _context.Users,
                        address => address.UsrId,
                        user => user.UsrId,
                        (address, user) => new { Address = address, User = user }
                    )
                    .Where(joined => joined.User.CreatedAt >= fromDate && joined.User.CreatedAt <= toDate)
                    .GroupBy(joined => joined.Address.City)
                    .Select(group => new UserLocationDto
                    {
                        Location = group.Key ?? "Unknown",
                        UserCount = group.Select(x => x.User.UsrId).Distinct().Count()
                    })
                    .OrderByDescending(item => item.UserCount)
                    .ToListAsync(cancellationToken);

                return new ListUserByLocationDto
                {
                    UserByLocation = usersByLocation
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting user count by location between {FromDate} and {ToDate}", fromDate, toDate);
                throw;
            }
        }

        public async Task<UserGrowthRateDto> GetUserGrowthRateAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
        {
            try
            {
                // Count users in current period
                int currentUserCount = await _context.Users
                    .CountAsync(u => u.CreatedAt >= fromDate && u.CreatedAt <= toDate, cancellationToken);

                // Calculate previous period dates (one month before)
                DateTime previousFromDate = fromDate.AddMonths(-1);
                DateTime previousToDate = toDate.AddMonths(-1);

                // Count users in previous period
                int previousUserCount = await _context.Users
                    .CountAsync(u => u.CreatedAt >= previousFromDate && u.CreatedAt <= previousToDate, cancellationToken);

                // Calculate growth rate percentage
                decimal? growthRatePercent = previousUserCount == 0
                    ? null
                    : Math.Round((decimal)(currentUserCount - previousUserCount) * 100.0m / previousUserCount, 2);

                return new UserGrowthRateDto
                {
                    CurrentUserCount = currentUserCount,
                    PreviousUserCount = previousUserCount,
                    UserGrowthRate = growthRatePercent.HasValue ? (double)growthRatePercent.Value : 0.0
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calculating user growth rate between {FromDate} and {ToDate}", fromDate, toDate);
                throw;
            }
        }

        public Task<GetUserRetentionRateDto> GetUserRetentionAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Get first day of previous month
                DateTime now = DateTime.Now;
                DateTime firstDayLastMonth = new DateTime(now.Year, now.AddMonths(-1).Month, 1);
                DateTime firstDayCurrentMonth = new DateTime(now.Year, now.Month, 1);

                // Get users registered last month
                var registeredUsers = _context.Users
                    .Where(u => u.CreatedAt >= firstDayLastMonth && u.CreatedAt < firstDayCurrentMonth)
                    .ToList();

                if (registeredUsers.Count == 0)
                {
                    // No users registered last month
                    return Task.FromResult(new GetUserRetentionRateDto
                    {
                        After1Month = 0,
                        After3Month = 0,
                        After6Month = 0,
                        After12Month = 0
                    });
                }

                // Count users who placed orders after registration period
                var userIds = registeredUsers.Select(u => u.UsrId).ToList();

                var ordersWithUsers = _context.Orders
                    .Where(o => userIds.Contains(o.UsrId))
                    .AsEnumerable()
                    .GroupBy(o => o.UsrId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                int usersAfter1Month = 0;
                int usersAfter3Months = 0;
                int usersAfter6Months = 0;
                int usersAfter12Months = 0;

                foreach (var user in registeredUsers)
                {
                    if (!ordersWithUsers.TryGetValue(user.UsrId, out var userOrders))
                        continue;

                    // Calculate retention for each period
                    if (userOrders.Any(o => o.CreatedAt >= user.CreatedAt.AddMonths(1)))
                        usersAfter1Month++;

                    if (userOrders.Any(o => o.CreatedAt >= user.CreatedAt.AddMonths(3)))
                        usersAfter3Months++;

                    if (userOrders.Any(o => o.CreatedAt >= user.CreatedAt.AddMonths(6)))
                        usersAfter6Months++;

                    if (userOrders.Any(o => o.CreatedAt >= user.CreatedAt.AddMonths(12)))
                        usersAfter12Months++;
                }

                // Calculate retention rates
                decimal totalUsers = registeredUsers.Count;
                decimal retention1Month = Math.Round((usersAfter1Month / totalUsers) * 100, 2);
                decimal retention3Month = Math.Round((usersAfter3Months / totalUsers) * 100, 2);
                decimal retention6Month = Math.Round((usersAfter6Months / totalUsers) * 100, 2);
                decimal retention12Month = Math.Round((usersAfter12Months / totalUsers) * 100, 2);

                return Task.FromResult(new GetUserRetentionRateDto
                {
                    After1Month = (double)retention1Month,
                    After3Month = (double)retention3Month,
                    After6Month = (double)retention6Month,
                    After12Month = (double)retention12Month
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calculating user retention rates");
                throw;
            }
        }

        public Task<bool> IsExistedEmail(string email)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Email == email);
            return Task.FromResult(user != null);
        }

        public Task<bool> IsExistedPhone(string phone)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Phone == phone);
            return Task.FromResult(user != null);
        }

        public IQueryable<User> SearchUsers(string? keyword = null, int? page = null, int? limit = null, 
            string? gender = null, int? status = null, int? role = null,
            DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.Users.AsNoTracking()
                .Include(user => user.Usr)
                .Where(user => 
                    (string.IsNullOrEmpty(keyword) || 
                    user.UsrId.ToString().Contains(keyword) || 
                    (user.Fullname ?? string.Empty).Contains(keyword) ||
                    (user.Phone ?? string.Empty).Contains(keyword) ||
                    (user.Email ?? string.Empty).Contains(keyword) ||
                    (user.Usr.Username ?? string.Empty).Contains(keyword))
                    && (gender == null || user.Gender == short.Parse(gender))
                    && (status == null || (int)user.Usr.AccStatusId == status)
                    && (role == null || (int)user.Usr.RoleId == role)
                    && (!fromDate.HasValue || user.Dob >= DateOnly.FromDateTime(fromDate.Value))
                    && (!toDate.HasValue || user.Dob <= DateOnly.FromDateTime(toDate.Value)));

            if (page.HasValue && limit.HasValue)
            {
                query = query.Skip((page.Value - 1) * limit.Value).Take(limit.Value);
            }

            return query;
        }

        public Task<bool> UpdateEmailVerifyTokenAsync(long usrId, string token)
        {
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == usrId);
            if (user == null)
                return Task.FromResult(false);
            user.EmailVerifyToken = token;
            _context.Users.Update(user);
            return Task.FromResult(true);
        }

        public Task<bool> UpdateForgotPasswordTokenAsync(long usrId, string token)
        {
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == usrId);
            if (user == null)
                return Task.FromResult(false);
            user.ForgotPasswordToken = token;
            _context.Users.Update(user);
            return Task.FromResult(true);
        }

        public Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Update(user);
            return Task.FromResult(true);
        }

        public async Task<bool> VerifyEmail(long usrId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UsrId == usrId);

            if (user == null)
            {
                return false;
            }

            user.EmailVerifyToken = null;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true; 
        }
    }
}