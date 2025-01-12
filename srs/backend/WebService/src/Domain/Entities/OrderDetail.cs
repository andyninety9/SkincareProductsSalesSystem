using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class OrderDetail
{
    public long OrdDetailId { get; set; }

    public long OrdId { get; set; }

    public long ProdId { get; set; }

    public short Quantity { get; set; }

    public double SellPrice { get; set; }

    public virtual Order Ord { get; set; } = null!;

    public virtual Product Prod { get; set; } = null!;
}
