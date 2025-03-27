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
    public class ReturnProductDetailRepository : Repository<ReturnProductDetail>, IReturnProductDetailRepository
    {
        public ReturnProductDetailRepository(MyDbContext context) : base(context)
        {
        }

        public Task<List<ReturnProductDetail>> GetByReturnIdAsync(long returnId, CancellationToken cancellationToken)
        {
            return _context.ReturnProductDetails
                .Where(x => x.ReturnId == returnId)
                .ToListAsync(cancellationToken);
        }
    }
}