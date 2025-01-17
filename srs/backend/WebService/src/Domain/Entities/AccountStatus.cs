using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class AccountStatus
{
    public short AccStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
