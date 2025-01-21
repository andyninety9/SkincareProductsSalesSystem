using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class EventDetail
{
    public long EventDetailId { get; set; }

    public long ProductId { get; set; }

    public long EventId { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
