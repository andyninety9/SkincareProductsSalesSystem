using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class AccountStatus
{
    public string AccStatusId { get; set; } = null!;

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
