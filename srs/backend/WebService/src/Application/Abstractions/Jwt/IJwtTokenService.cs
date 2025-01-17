using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Common.Jwt
{
    public interface IJwtTokenService
    {
        // Generate JWT token for user
        string GenerateToken(long userId, int roleId, int expireMinutes, IEnumerable<Claim>? additionalClaims = null);

        // Get user id from token
        long GetAccountIdFromToken(string token);

        int GetRoleIdFromToken(string token);

        // Get claims from token
        ClaimsPrincipal GetPrincipalFromToken(string token);
        
    }
}