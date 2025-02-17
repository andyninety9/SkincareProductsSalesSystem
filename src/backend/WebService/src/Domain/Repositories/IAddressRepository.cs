using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IAddressRepository : IRepository<Address>
    {
        Task<bool> SwitchStatusDefaultAddress(long usrId);
    }
}