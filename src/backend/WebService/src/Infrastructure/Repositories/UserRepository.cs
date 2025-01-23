using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class UserRepository :  Repository<User>, IUserRepository
    {
        public UserRepository(MyDbContext context) : base(context)
        {
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