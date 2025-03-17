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

        public Task<Voucher?> GetByCodeAsync(string code, CancellationToken cancellationToken)
        {
            var result = _context.Vouchers.FirstOrDefault(v => v.VoucherCode == code);
            return Task.FromResult(result);
        }

        public Task<IEnumerable<Voucher>> GetVouchersByUserIdAsync(long userId, CancellationToken cancellationToken)
        {
            var result = _context.Vouchers.Where(v => v.UsrId == userId).ToList();
            return Task.FromResult<IEnumerable<Voucher>>(result);
        }
    }
}