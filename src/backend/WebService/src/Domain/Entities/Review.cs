using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Review
{
    public long ReviewId { get; set; }

    public string ReviewContent { get; set; } = null!;

    public long UsrId { get; set; }

    public long ProdId { get; set; }

    public double Rating { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Product Prod { get; set; } = null!;
}
