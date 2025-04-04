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
    public class PaymentRepository : Repository<Payment>, IPaymentRepository
    {
        public PaymentRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<Payment?> GetPaymentByOrderIdAsync(long id)
        {
            return await Task.FromResult(_context.Payments.FirstOrDefault(p => p.OrderId == id));
            
        }
    }
}