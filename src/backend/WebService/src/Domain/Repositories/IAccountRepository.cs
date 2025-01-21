using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IAccountRepository: IRepository<Account>
    {
        public Task<bool> IsExistedUsername(string username);
        public Task<Account?> GetAccountByUsername(string email);
        public Task<Account?> LoginAsync(string username, String password);

        public Task<bool> UpdateAccountStatusId(long accountId, short statusID);
    }
}