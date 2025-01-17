using System.Security.Claims;
using Application.Common.Jwt;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace Infrastructure.JWT
{
    public class JwtTokenService : IJwtTokenService
    {
        
        private readonly IOptions<JwtConfigService> _jwtConfigOptions;
        public JwtTokenService(IOptions<JwtConfigService> jwtConfigOptions)
        {
            _jwtConfigOptions = jwtConfigOptions;
        }

        public string GenerateToken(long userId,int roleId, int expireMinutes, IEnumerable<Claim>? additionalClaims = null)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim("roleId", roleId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token ID
            };

            if (additionalClaims != null)
            {
                claims.AddRange(additionalClaims);
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfigOptions.Value.JwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _jwtConfigOptions.Value.JwtIssuer,
                audience: _jwtConfigOptions.Value.JwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public long GetAccountIdFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfigOptions.Value.JwtKey));
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _jwtConfigOptions.Value.JwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtConfigOptions.Value.JwtAudience,
                ValidateLifetime = true
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            return long.Parse(jwtToken.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sub).Value);
        }

        public ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfigOptions.Value.JwtKey));
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _jwtConfigOptions.Value.JwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtConfigOptions.Value.JwtAudience,
                ValidateLifetime = true
            }, out SecurityToken validatedToken);

            return tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _jwtConfigOptions.Value.JwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtConfigOptions.Value.JwtAudience,
                ValidateLifetime = true
            }, out validatedToken);
            

        }

        public int GetRoleIdFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfigOptions.Value.JwtKey));
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _jwtConfigOptions.Value.JwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtConfigOptions.Value.JwtAudience,
                ValidateLifetime = true
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            return int.Parse(jwtToken.Claims.First(claim => claim.Type == "roleId").Value);
            
        }
    }
}