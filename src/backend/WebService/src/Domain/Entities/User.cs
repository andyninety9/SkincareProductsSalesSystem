using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class User
{
    public long UsrId { get; set; }

    public string? Fullname { get; set; }

    public short? Gender { get; set; }

    public string? Phone { get; set; }

    public string Email { get; set; } = null!;

    public DateOnly? Dob { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? EmailVerifyToken { get; set; }

    public string? ForgotPasswordToken { get; set; }

    public string? AvatarUrl { get; set; }

    public string? CoverUrl { get; set; }

    /// <summary>
    /// 0-250: Bronze rank
    /// 250-1500: Silver rank
    /// Over 1500: Gold rank
    /// </summary>
    public short RewardPoint { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<ResultQuiz> ResultQuizzes { get; set; } = new List<ResultQuiz>();

    public virtual ICollection<ReturnProduct> ReturnProducts { get; set; } = new List<ReturnProduct>();

    public virtual Account Usr { get; set; } = null!;

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
