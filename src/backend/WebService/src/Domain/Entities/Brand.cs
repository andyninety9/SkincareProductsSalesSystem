using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Brand
{
    public long BrandId { get; set; }

    public string BrandName { get; set; } = null!;

    public string? BrandDesc { get; set; }

    public string BrandOrigin { get; set; } = null!;

    public bool BrandStatus { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
