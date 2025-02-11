using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetNextQuestionResponse
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public string Category { get; set; }
        public List<KeyQuestionResponse> KeyQuestions { get; set; }
        public bool IsFinalQuestion { get; set; } // Nếu true, frontend sẽ hiển thị kết quả thay vì câu hỏi tiếp theo
        public int SkinTypeId { get; set; } // ID của loại skin
    }
}