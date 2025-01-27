using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.Authorization;

namespace Infrastructure.Authorization
{
    public class AuthorizationService : IAuthorizationService
    {
        public bool HasRole(string roleId, params string[] requiredRoles)
        {
            return requiredRoles.Contains(roleId);
        }
    }
}