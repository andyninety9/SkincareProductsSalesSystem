using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IVoucherRepository : IRepository<Voucher>
    {
        Task<IEnumerable<Voucher>> GetVouchersByUserIdAsync(long userId, CancellationToken cancellationToken);

        Task<Voucher?> GetByCodeAsync(string code, CancellationToken cancellationToken);
        
    }
}