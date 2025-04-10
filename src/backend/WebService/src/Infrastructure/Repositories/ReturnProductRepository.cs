using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class ReturnProductRepository : Repository<ReturnProduct>, IReturnProductRepository
    {
        public ReturnProductRepository(MyDbContext context) : base(context)
        {
        }

    }
}