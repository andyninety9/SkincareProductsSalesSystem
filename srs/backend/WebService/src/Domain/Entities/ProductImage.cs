using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ProductImage
{
    public long ProductImageId { get; set; }

    public long ProductId { get; set; }

    public string ProductImageUrl { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
