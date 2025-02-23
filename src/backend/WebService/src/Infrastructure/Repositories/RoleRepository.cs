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
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<Role> GetRoleById(short id)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(x => x.RoleId == id);
            if (role == null)
                throw new KeyNotFoundException($"Role with ID {id} was not found.");
            return role;
            
        }
    }
}