using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Abstractions.Authorization
{
    public interface IAuthorizationService
    {
        bool HasRole(string roleId, params string[] requiredRoles);
    }
}