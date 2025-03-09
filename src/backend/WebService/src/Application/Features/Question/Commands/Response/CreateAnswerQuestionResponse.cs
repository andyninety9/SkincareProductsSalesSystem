using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Application.Features.Question.Commands.Response
{
    public class CreateAnswerQuestionResponse
    {
        public short QuestionId { get; set; }
        public List<KeyQuestionResponse> KeyQuestions { get; set; } = new List<KeyQuestionResponse>();

    }
}