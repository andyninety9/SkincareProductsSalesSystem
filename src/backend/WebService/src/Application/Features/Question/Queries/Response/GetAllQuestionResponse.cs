using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Features.Question.Queries.Response
{
    public class GetAllQuestionResponse
    {
        public short QuestionId { get; set; }

        public short CateQuestionId { get; set; }

        public string QuestionContent { get; set; } = null!;

        public DateOnly CreatedAt { get; set; }

        public bool StatusQuestion { get; set; }

        public List<KeyQuestionResponse> KeyQuestions { get; set; } = new List<KeyQuestionResponse>();

    }
}