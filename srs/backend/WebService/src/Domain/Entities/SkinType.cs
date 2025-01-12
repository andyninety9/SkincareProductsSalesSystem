using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinType
{
    public long SkinTypeId { get; set; }

    public string SkinType1 { get; set; } = null!;

    public string SkinTypeDesc { get; set; } = null!;

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
