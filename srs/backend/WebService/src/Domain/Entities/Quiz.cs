using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Quiz
{
    public long QuizId { get; set; }

    public string QuizName { get; set; } = null!;

    public string QuizDesc { get; set; } = null!;

    public DateOnly CreatedAt { get; set; }

    public virtual ICollection<QuizDetail> QuizDetails { get; set; } = new List<QuizDetail>();

    public virtual ICollection<ResultQuiz> ResultQuizzes { get; set; } = new List<ResultQuiz>();
}
