using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ProductStatus
{
    public short ProdStatusId { get; set; }

    public string ProdStatusName { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
