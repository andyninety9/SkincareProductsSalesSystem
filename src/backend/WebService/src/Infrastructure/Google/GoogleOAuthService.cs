using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Abstractions.Google;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Google
{
    public class GoogleOAuthService : IGoogleOAuthService
    {
        private readonly GoogleAuthConfig _googleAuthConfig;
        private readonly ILogger<GoogleOAuthService> _logger;

        public GoogleOAuthService(GoogleAuthConfig googleAuthConfig, ILogger<GoogleOAuthService> logger)
        {
            _googleAuthConfig = googleAuthConfig;
            _logger = logger;
        }

        /// <summary>
        /// Authenticate ID Token with Google OAuth API
        /// </summary>
        /// <param name="idToken">ID Token issued by Google</param>
        /// <returns>User information from token</returns>
        public async Task<GoogleJsonWebSignature.Payload?> AuthenticateWithGoogle(string idToken)
        {
            if (string.IsNullOrEmpty(idToken))
            {
                _logger.LogWarning("ID Token is null or empty.");
                return null; // ✅ Trả về `null` đúng với interface
            }

            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string> { _googleAuthConfig.ClientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                _logger.LogInformation("Google ID Token successfully validated for user: {Email}", payload.Email);
                return payload;
            }
            catch (InvalidJwtException ex)
            {
                _logger.LogError(ex, "Invalid Google ID Token.");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while validating Google ID Token.");
                return null;
            }
        }

    }
}
