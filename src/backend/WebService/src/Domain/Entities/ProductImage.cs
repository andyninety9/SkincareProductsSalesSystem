using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ProductImage
{
    public long ProdImageId { get; set; }

    public long ProdId { get; set; }

    public string ProdImageUrl { get; set; } = null!;

    public virtual Product Prod { get; set; } = null!;
}
