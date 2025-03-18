using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Users.Response
{
    public class GetUserQuizHistoryResponse
    {
        public long QuizId { get; set; }

        public string QuizName { get; set; } = null!;

        public string QuizDesc { get; set; } = null!;

        public DateOnly CreatedAt { get; set; }
    }
}