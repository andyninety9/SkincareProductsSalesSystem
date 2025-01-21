using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AccountRepository : Repository<Account>, IAccountRepository
    {
        public AccountRepository(MyDbContext context) : base(context)
        {
        }

        public Task<Account?> GetAccountByUsername(string username)
        {
            Account? account = _context.Accounts.FirstOrDefault(a => a.Username == username);
            return Task.FromResult(account);
        }

        public async Task<bool> IsExistedUsername(string username)
        {
            Account? account = await _context.Accounts.FirstOrDefaultAsync(u => u.Username == username);
            return account != null;
        }

        public async Task<Account?> LoginAsync(string username, string password)
        {
            Account? account = await GetAccountByUsername(username);
            if (account == null || !BCrypt.Net.BCrypt.Verify(password, account.Password))
            {
                return null;
            }
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.UsrId == account.AccId);
            return account;
        }

        public async Task<bool> UpdateAccountStatusId(long accountId, short statusID)
        {
            Account? account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccId == accountId);
            if (account == null)
            {
                return false;
            }
            account.AccStatusId = statusID;
            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();
            return true;
        }
        
    }
}