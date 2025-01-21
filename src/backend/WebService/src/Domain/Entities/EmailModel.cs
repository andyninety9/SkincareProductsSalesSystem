namespace Domain.Entities
{
    public class EmailModel
    {
        public string To { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string From { get; set; } = string.Empty;
        public string ToName { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
        public List<string> BccAddresses { get; set; } = new List<string>(); 
        public List<string> CcAddresses { get; set; } = new List<string>();
        public Dictionary<string, string> Headers { get; set; } = new Dictionary<string, string>();
        public bool IsHtml { get; set; } = true;
    }
}