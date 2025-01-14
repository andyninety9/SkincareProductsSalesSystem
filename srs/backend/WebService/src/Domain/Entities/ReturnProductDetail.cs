using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ReturnProductDetail
{
    public long ReturnProductDetailId { get; set; }

    public long ProdId { get; set; }

    public long ReturnId { get; set; }

    public string ReturnImgUrl { get; set; } = null!;

    public short ReturnQuantity { get; set; }

    public virtual Product Prod { get; set; } = null!;

    public virtual ReturnProduct Return { get; set; } = null!;
}
