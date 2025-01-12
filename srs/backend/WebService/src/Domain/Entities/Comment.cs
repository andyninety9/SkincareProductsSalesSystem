using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Comment
{
    public long CommentId { get; set; }

    public string CommentContent { get; set; } = null!;

    public long UsrId { get; set; }

    public long ProdId { get; set; }

    public DateTime CreateAt { get; set; }

    public long UpdateAd { get; set; }

    public virtual Product Prod { get; set; } = null!;

    public virtual User Usr { get; set; } = null!;
}
