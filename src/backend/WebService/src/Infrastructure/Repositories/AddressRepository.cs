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
            var address = await _context.Addresses.FirstOrDefaultAsync(x => x.AddressId == addressId);
            if (address != null)
            {
            // Set all addresses IsDefault to false
            await _context.Addresses.Where(x => x.UsrId == address.UsrId)
                .ForEachAsync(x => x.IsDefault = false);
            
            // Set new default address
            address.IsDefault = true;
            await _context.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> ChangeStatusAddressAsync(long addressId, bool status, CancellationToken cancellationToken)
        {
            await _context.Addresses.Where(x => x.AddressId == addressId).ForEachAsync(x => x.Status = status, cancellationToken: cancellationToken);
            await _context.Addresses.Where(x => x.AddressId == addressId).ForEachAsync(x => x.IsDefault = false, cancellationToken: cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

 
    }
}