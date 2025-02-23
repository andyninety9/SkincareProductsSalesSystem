using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetStartQuestionResponse
    {
        public long QuizId { get; set; } // Mã bài kiểm tra mới
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public List<KeyQuestionResponse> KeyQuestions { get; set; } = new List<KeyQuestionResponse>();
    }
}