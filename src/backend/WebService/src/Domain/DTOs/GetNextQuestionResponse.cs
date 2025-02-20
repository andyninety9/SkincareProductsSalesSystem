using System.Text.Json.Serialization;

namespace Domain.DTOs
{
    public class GetNextQuestionResponse
    {
        public int QuestionNumber { get; set; }
        public long QuizId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? QuestionId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? QuestionText { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Category { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<KeyQuestionResponse>? KeyQuestions { get; set; }

        public bool IsFinalQuestion { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? SkinTypeId { get; set; } // Chỉ hiển thị khi IsFinalQuestion = true
    }
}
