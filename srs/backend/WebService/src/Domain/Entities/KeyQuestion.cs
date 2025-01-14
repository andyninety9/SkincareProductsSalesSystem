using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class KeyQuestion
{
    public short KeyId { get; set; }

    public short QuestionId { get; set; }

    public string KeyContent { get; set; } = null!;

    public short KeyScore { get; set; }

    public DateOnly CreatedAt { get; set; }

    public virtual ICollection<AnswerUser> AnswerUsers { get; set; } = new List<AnswerUser>();

    public virtual Question Question { get; set; } = null!;
}
