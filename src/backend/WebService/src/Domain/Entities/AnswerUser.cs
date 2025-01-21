using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class AnswerUser
{
    public long AndId { get; set; }

    public short QuestionId { get; set; }

    public short KeyId { get; set; }

    public virtual KeyQuestion Key { get; set; } = null!;

    public virtual Question Question { get; set; } = null!;
}
