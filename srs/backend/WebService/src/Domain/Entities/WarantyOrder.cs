using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class WarantyOrder
{
    public long WarantyId { get; set; }

    public long OrdId { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime EndDate { get; set; }

    public virtual Order Ord { get; set; } = null!;
}
