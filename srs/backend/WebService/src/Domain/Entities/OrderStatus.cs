using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class OrderStatus
{
    public string OrdStatusId { get; set; } = null!;

    public string OrdStatusName { get; set; } = null!;

    public virtual ICollection<OrderLog> OrderLogs { get; set; } = new List<OrderLog>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
