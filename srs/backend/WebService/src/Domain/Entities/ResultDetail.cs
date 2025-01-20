using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ResultDetail
{
    public long ResultDetailId { get; set; }

    public long ResultId { get; set; }

    public short KeyId { get; set; }

    public virtual KeyQuestion Key { get; set; } = null!;

    public virtual ResultQuiz Result { get; set; } = null!;
}
