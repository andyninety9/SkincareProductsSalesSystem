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
    public class AddressRepository : Repository<Address>, IAddressRepository
    {
        public AddressRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<bool> ActiveByIdAsync(long addressId)
        {
            await _context.Addresses.Where(x => x.AddressId == addressId).ForEachAsync(x => x.IsDefault = !x.IsDefault);
            await _context.SaveChangesAsync();
            return true;                
            
        }

        public async Task<bool> SwitchStatusDefaultAddress(long usrId)
        {
            var addresses = await _context.Addresses.Where(x => x.UsrId == usrId).ToListAsync();
            foreach (var address in addresses)
            {
                address.IsDefault = false;
            }
            await _context.SaveChangesAsync();
            return true;
        }
    }
}