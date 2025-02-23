using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class KeyQuestionResponse
    {
        public short KeyId { get; set; } // ID KeyQuestion
        public string KeyContent { get; set; } = string.Empty; // Nội dung của KeyQuestion
        public short KeyScore { get; set; } // Điểm số của KeyQuestion
    }
}