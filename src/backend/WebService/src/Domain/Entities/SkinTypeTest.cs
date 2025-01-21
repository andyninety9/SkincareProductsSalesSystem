using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinTypeTest
{
    public long TestId { get; set; }

    public string TestName { get; set; } = null!;

    public string TestDesc { get; set; } = null!;

    public long CreatedByUsrId { get; set; }

    public DateOnly CreatedAt { get; set; }

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual ICollection<SkinTypeTestDetail> SkinTypeTestDetails { get; set; } = new List<SkinTypeTestDetail>();
}
