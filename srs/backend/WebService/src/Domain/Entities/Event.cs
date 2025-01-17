using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Event
{
    public long EventId { get; set; }

    public string EventName { get; set; } = null!;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string? EventDesc { get; set; }

    public double DiscountPercent { get; set; }

    public virtual ICollection<EventDetail> EventDetails { get; set; } = new List<EventDetail>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
