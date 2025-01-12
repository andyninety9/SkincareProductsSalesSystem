using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Account
{
    public long AccId { get; set; }

    public long RoleId { get; set; }

    public long AccStatusId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual User Acc { get; set; } = null!;

    public virtual AccountStatus AccStatus { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
