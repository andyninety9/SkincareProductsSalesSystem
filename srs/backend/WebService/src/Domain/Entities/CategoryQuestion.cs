using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class CategoryQuestion
{
    public short CateQuestionId { get; set; }

    public string CateName { get; set; } = null!;

    public string CateDesc { get; set; } = null!;

    public DateOnly CreatedAt { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
