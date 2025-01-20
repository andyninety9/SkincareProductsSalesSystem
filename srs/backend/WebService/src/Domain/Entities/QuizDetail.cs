using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class QuizDetail
{
    public long DetailId { get; set; }

    public short QuestId { get; set; }

    public long QuizId { get; set; }

    public virtual Question Quest { get; set; } = null!;

    public virtual Quiz Quiz { get; set; } = null!;
}
