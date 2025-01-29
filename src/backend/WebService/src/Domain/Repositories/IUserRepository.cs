using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<bool> IsExistedPhone(string phone);
        public Task<bool> IsExistedEmail(string email);
        public Task<User> GetUserByAccountId(long accountId);

        public Task<string> GetEmailVerifyTokenByUsrID(long usrId);

        public Task<bool> VerifyEmail(long usrId);

        public Task<User> GetByEmailAsync(string email);

        public Task<bool> UpdateEmailVerifyTokenAsync(long usrId, string token);

        public Task<bool> UpdateForgotPasswordTokenAsync(long usrId, string token);

        public Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken);

        public IQueryable<User> GetAllUsers();

        public IQueryable<User> SearchUsers(string? keyword = null, int? page = null, int? limit = null,
            string? gender = null, int? status = null, int? role = null,
            DateTime? fromDate = null, DateTime? toDate = null);


    }
}