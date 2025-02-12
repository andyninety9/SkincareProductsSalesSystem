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
        public string QuestionText { get; set; }
        public string Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<KeyQuestionResponse> KeyQuestions { get; set; }
    }
}