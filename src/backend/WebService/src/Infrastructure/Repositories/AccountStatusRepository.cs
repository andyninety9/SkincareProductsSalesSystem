using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AccountStatusRepository : Repository<AccountStatus>, IAccountStatusRepository
    {
        public AccountStatusRepository(MyDbContext context) : base(context)
        {
        }

public async Task<AccountStatus> GetAccountStatusById(short id)
{
    var status = await _context.AccountStatuses.FirstOrDefaultAsync(x => x.AccStatusId == id);
    if (status == null)
        throw new KeyNotFoundException($"Account status with ID {id} was not found.");
    return status;
}
    }
}