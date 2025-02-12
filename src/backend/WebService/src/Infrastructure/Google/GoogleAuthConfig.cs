namespace Infrastructure.Google
{
    public class GoogleAuthConfig
    {

        public string ClientId { get; set; }
        public string ClientSecret { get; set; }

        public GoogleAuthConfig()
        {
            ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? string.Empty;
            ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ?? string.Empty;
        }
    }
}