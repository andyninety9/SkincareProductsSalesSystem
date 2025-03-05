using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class VoucherRepository : Repository<Voucher>, IVoucherRepository
    {
        public VoucherRepository(MyDbContext context) : base(context)
        {
        }

        public Task<List<Voucher>> GetVouchersByUserIdAsync(long userId, CancellationToken cancellationToken)
        {
            var result = _context.Vouchers.Where(v => v.UsrId == userId && v.StatusVoucher == true).ToList();
            return Task.FromResult(result);
        }
    }
}