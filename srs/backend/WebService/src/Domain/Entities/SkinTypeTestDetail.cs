using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinTypeTestDetail
{
    public long DetailId { get; set; }

    public short QuestionId { get; set; }

    public long TestId { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual SkinTypeTest Test { get; set; } = null!;
}
