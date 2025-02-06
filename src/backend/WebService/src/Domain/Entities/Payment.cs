using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Payment
{
    public long PaymentId { get; set; }

    public long OrderId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public double PaymentAmount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;
}
