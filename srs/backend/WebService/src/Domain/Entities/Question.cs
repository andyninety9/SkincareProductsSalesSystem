using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Question
{
    public short QuestionId { get; set; }

    public short CateQuestionId { get; set; }

    public string QuestionContent { get; set; } = null!;

    public long AnsId { get; set; }

    public DateOnly CreatedAt { get; set; }

    public virtual ICollection<AnswerUser> AnswerUsers { get; set; } = new List<AnswerUser>();

    public virtual CategoryQuestion CateQuestion { get; set; } = null!;

    public virtual ICollection<KeyQuestion> KeyQuestions { get; set; } = new List<KeyQuestion>();

    public virtual ICollection<SkinTypeTestDetail> SkinTypeTestDetails { get; set; } = new List<SkinTypeTestDetail>();
}
