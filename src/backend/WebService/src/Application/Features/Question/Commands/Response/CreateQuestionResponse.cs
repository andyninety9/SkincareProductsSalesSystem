using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.ResponseModel;

namespace Application.Features.Question.Command.Response
{
    public class CreateQuestionResponse
    {
        public CreateQuestionResponse()
        {
        }
        
        public short CateQuestionId { get; set; }

        public string QuestionContent { get; set; } = null!;
        public List<Error> Errors { get; set; } = new List<Error>();

    }
}