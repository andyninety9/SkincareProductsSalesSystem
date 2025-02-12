using Google.Apis.Auth;

namespace Application.Abstractions.Google
{
    public interface IGoogleOAuthService
    {
        Task<GoogleJsonWebSignature.Payload?> AuthenticateWithGoogle(string idToken);
    }
}
