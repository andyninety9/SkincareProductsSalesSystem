using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class RatingProduct
{
    public long RatingProdId { get; set; }

    public long UsrId { get; set; }

    public long ProdId { get; set; }

    public short Rating { get; set; }

    public virtual Product Prod { get; set; } = null!;
}
