using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class OrderStatus
{
    public short OrdStatusId { get; set; }

    public string OrdStatusName { get; set; } = null!;

    public virtual ICollection<OrderLog> OrderLogs { get; set; } = new List<OrderLog>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
