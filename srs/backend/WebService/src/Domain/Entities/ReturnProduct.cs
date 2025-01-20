using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ReturnProduct
{
    public long ReturnId { get; set; }

    public long OrdIdd { get; set; }

    public long UsrId { get; set; }

    public DateOnly ReturnDate { get; set; }

    public double RefundAmount { get; set; }

    public bool ReturnStatus { get; set; }

    public virtual Order OrdIddNavigation { get; set; } = null!;

    public virtual ICollection<ReturnProductDetail> ReturnProductDetails { get; set; } = new List<ReturnProductDetail>();

    public virtual User Usr { get; set; } = null!;
}
