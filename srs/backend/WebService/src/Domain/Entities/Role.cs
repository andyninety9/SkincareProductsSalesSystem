using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Role
{
    public string RoleId { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public bool RoleStatus { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
