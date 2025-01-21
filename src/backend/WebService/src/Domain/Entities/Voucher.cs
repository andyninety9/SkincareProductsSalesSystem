using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Voucher
{
    public long VoucherId { get; set; }

    public double VoucherDiscount { get; set; }

    public long UsrId { get; set; }

    public string VoucherDesc { get; set; } = null!;

    public virtual User Usr { get; set; } = null!;
}
