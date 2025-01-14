using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class User
{
    public long UsrId { get; set; }

    public string? Fullname { get; set; }

    public string? Gender { get; set; }

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateOnly? Dob { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public string? EmailVerifyToken { get; set; }

    public string? ForgotPasswordToken { get; set; }

    public string? AvatarUrl { get; set; }

    public string? CoverUrl { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual ICollection<ReturnProduct> ReturnProducts { get; set; } = new List<ReturnProduct>();

    public virtual Account Usr { get; set; } = null!;

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
