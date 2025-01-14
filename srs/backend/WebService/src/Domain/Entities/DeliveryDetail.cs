using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class DeliveryDetail
{
    public long DeliId { get; set; }

    public long DeliServiceId { get; set; }

    public long AddressId { get; set; }

    public string DeliPhoneNumber { get; set; } = null!;

    public long OrdId { get; set; }

    /// <summary>
    /// Just manage 2 status: Success / False
    /// </summary>
    public bool DeliStatus { get; set; }

    public DateTime CreateAt { get; set; }

    public virtual DeliveryService DeliService { get; set; } = null!;

    public virtual Order Ord { get; set; } = null!;
}
