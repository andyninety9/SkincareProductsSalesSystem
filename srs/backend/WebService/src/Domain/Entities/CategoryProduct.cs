using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class CategoryProduct
{
    public long CateProdId { get; set; }

    public string CateProdName { get; set; } = null!;

    public bool CateProdStatus { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
