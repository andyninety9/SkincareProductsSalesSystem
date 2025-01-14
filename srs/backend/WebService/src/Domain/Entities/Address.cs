using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Address
{
    public long AddressId { get; set; }

    public long UsrId { get; set; }

    public string AddDetail { get; set; } = null!;

    public string Ward { get; set; } = null!;

    public string District { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Country { get; set; } = null!;

    public bool IsDefault { get; set; }

    public virtual User Usr { get; set; } = null!;
}
