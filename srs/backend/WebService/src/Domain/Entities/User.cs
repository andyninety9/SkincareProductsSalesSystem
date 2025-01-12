using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class User
{
    public long UsrId { get; set; }

    public long? AddressId { get; set; }

    public long? SkinTypeId { get; set; }

    public long? SkinCondId { get; set; }

    public string? Fullname { get; set; }

    public string Email { get; set; } = null!;

    public DateOnly? Dob { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public string? EmailVerifyToken { get; set; }

    public string? ForgotPasswordToken { get; set; }

    public string? AvatarUrl { get; set; }

    public string? CoverUrl { get; set; }

    public virtual Account? Account { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<OrderLog> OrderLogs { get; set; } = new List<OrderLog>();

    public virtual ICollection<RatingProduct> RatingProducts { get; set; } = new List<RatingProduct>();

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual SkinCondition? SkinCond { get; set; }

    public virtual SkinType? SkinType { get; set; }

    public virtual ICollection<SkinTypeTest> SkinTypeTests { get; set; } = new List<SkinTypeTest>();

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
