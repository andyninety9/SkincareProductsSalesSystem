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
    public class SkinTypeRepository : Repository<SkinType>, ISkinTypeRepository
    {
        public SkinTypeRepository(MyDbContext context) : base(context)
        {
        }
    }
}