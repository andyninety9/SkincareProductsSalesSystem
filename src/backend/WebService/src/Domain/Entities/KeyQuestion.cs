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

    public bool KeyQuestionStatus { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual ICollection<ResultDetail> ResultDetails { get; set; } = new List<ResultDetail>();
}
