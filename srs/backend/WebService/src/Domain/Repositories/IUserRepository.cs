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
        public Task<Boolean> IsExistedPhone(string phone);
        public Task<Boolean> IsExistedEmail(string email);
        public Task<User> GetUserByAccountId(long accountId);

        public Task<string> GetEmailVerifyTokenByUsrID(long usrId);

        public Task<bool> VerifyEmail(long usrId);


    }
}