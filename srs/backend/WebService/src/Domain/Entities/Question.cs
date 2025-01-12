using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Question
{
    public long QuestionId { get; set; }

    public long SkinTypeId { get; set; }

    public string QuestionContent { get; set; } = null!;

    public virtual SkinType SkinType { get; set; } = null!;

    public virtual ICollection<SkinTypeTestDetail> SkinTypeTestDetails { get; set; } = new List<SkinTypeTestDetail>();
}
