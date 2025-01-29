using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository :  Repository<User>, IUserRepository
    {
        public UserRepository(MyDbContext context) : base(context)
        {
        }

        public IQueryable<User> GetAllUsers()
        {
            return _context.Users.AsNoTracking().Include(user => user.Usr); ;
        }

        public Task<User> GetByEmailAsync(string email)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
                throw new KeyNotFoundException($"User with email {email} not found.");
            return Task.FromResult(user);
        }

        public Task<string> GetEmailVerifyTokenByUsrID(long usrId)
        {
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == usrId);
            return Task.FromResult(user?.EmailVerifyToken ?? string.Empty);
            
        }

        public Task<User> GetUserByAccountId(long accountId)
        {
            
            User? user = _context.Users.FirstOrDefault(u => u.UsrId == accountId);
            if (user == null)
                throw new KeyNotFoundException($"User with account ID {accountId} not found.");
            return Task.FromResult(user);
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