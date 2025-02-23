using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Question
{
    public short QuestionId { get; set; }

    public short CateQuestionId { get; set; }

    public string QuestionContent { get; set; } = null!;

    public DateOnly CreatedAt { get; set; }

    public bool StatusQuestion { get; set; }

    public virtual CategoryQuestion CateQuestion { get; set; } = null!;

    public virtual ICollection<KeyQuestion> KeyQuestions { get; set; } = new List<KeyQuestion>();

    public virtual ICollection<QuizDetail> QuizDetails { get; set; } = new List<QuizDetail>();
}
