using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class DeliveryService
{
    public long DeliServiceId { get; set; }

    public string ContactService { get; set; } = null!;

    public string DeliServiceName { get; set; } = null!;

    public bool DeliServiceStatus { get; set; }

    public virtual ICollection<DeliveryDetail> DeliveryDetails { get; set; } = new List<DeliveryDetail>();
}
