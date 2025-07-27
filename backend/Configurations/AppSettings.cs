namespace NextStepBackend.Configurations
{
    public class JwtSettings
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpiryInHours { get; set; }
    }
    
    public class AppSettings
    {
        public string ApiVersion { get; set; } = "v1";
        public int MaxFileUploadSizeMB { get; set; }
        public string[] AllowedImageTypes { get; set; } = Array.Empty<string>();
        public int DefaultUserLevel { get; set; }
        public int DefaultUserPoints { get; set; }
        public string BaseUrl { get; set; } = string.Empty;
    }
}
