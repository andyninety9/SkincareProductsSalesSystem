using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ReturnProductDetail
{
    public long ReturnProdDetailId { get; set; }

    public long ProdIdre { get; set; }

    public long ReturnId { get; set; }

    public string ReturnImgUrl { get; set; } = null!;

    public short ReturnQuantity { get; set; }

    public virtual Product ProdIdreNavigation { get; set; } = null!;

    public virtual ReturnProduct Return { get; set; } = null!;
}
