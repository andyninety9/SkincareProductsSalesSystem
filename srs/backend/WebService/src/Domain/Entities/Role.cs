using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Role
{
    public short RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public bool RoleStatus { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
