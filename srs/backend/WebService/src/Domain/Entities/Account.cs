using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Account
{
    public long AccId { get; set; }

    public short RoleId { get; set; }

    public short AccStatusId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual AccountStatus AccStatus { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;

    public virtual User? User { get; set; }
}
