using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ResultSkinTest
{
    public long ResultId { get; set; }

    public long TestId { get; set; }

    public long UsrId { get; set; }

    public long SkinTypeId { get; set; }

    public DateTime CreateAt { get; set; }

    public virtual SkinType SkinType { get; set; } = null!;

    public virtual SkinTypeTest Test { get; set; } = null!;

    public virtual User Usr { get; set; } = null!;
}
