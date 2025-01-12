using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinTypeTest
{
    public long TestId { get; set; }

    public long CreatedByUsrId { get; set; }

    public long TestDesc { get; set; }

    public DateTime CreateAt { get; set; }

    public virtual User CreatedByUsr { get; set; } = null!;

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual ICollection<SkinTypeTestDetail> SkinTypeTestDetails { get; set; } = new List<SkinTypeTestDetail>();
}
