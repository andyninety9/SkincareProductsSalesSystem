using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Address
{
    public long AddressId { get; set; }

    public string AddDetail { get; set; } = null!;

    public string Ward { get; set; } = null!;

    public string District { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Country { get; set; } = null!;

    public virtual ICollection<DeliveryDetail> DeliveryDetails { get; set; } = new List<DeliveryDetail>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
