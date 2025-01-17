using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.JWT
{
    public class JwtConfigService
    {
        public string JwtIssuer => Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "default";
        public string JwtAudience => Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "default";
        public string JwtKey => Environment.GetEnvironmentVariable("JWT_KEY") ?? "default";

    }
}