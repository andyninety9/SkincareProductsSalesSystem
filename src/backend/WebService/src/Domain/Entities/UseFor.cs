using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class UseFor
{
    public long RecId { get; set; }

    public long ProdId { get; set; }

    public short SkinTypeId { get; set; }

    public virtual Product Prod { get; set; } = null!;

    public virtual SkinType SkinType { get; set; } = null!;
}
