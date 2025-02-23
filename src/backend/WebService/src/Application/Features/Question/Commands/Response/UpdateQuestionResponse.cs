using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Question.Commands.Response
{
    public class UpdateQuestionResponse
    {
        public short QuestionId { get; set; }

        public short CateQuestionId { get; set; }

        public string QuestionContent { get; set; } = null!;

        public bool StatusQuestion { get; set; }

    }
}