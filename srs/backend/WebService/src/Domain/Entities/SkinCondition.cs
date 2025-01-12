using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinCondition
{
    public long SkinCondId { get; set; }

    public string Condition { get; set; } = null!;

    public string ConditionDesc { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
