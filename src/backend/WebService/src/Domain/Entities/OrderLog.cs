﻿using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class OrderLog
{
    public long OrdLogId { get; set; }

    public short NewStatusOrdId { get; set; }

    public long OrdId { get; set; }

    public long UsrId { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual OrderStatus NewStatusOrd { get; set; } = null!;

    public virtual Order Ord { get; set; } = null!;
}
