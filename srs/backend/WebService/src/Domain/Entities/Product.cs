using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Product
{
    public long ProductId { get; set; }

    public long CateId { get; set; }

    public long BrandId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? ProductDesc { get; set; }

    public int Stocks { get; set; }

    public double CostPrice { get; set; }

    public double SellPrice { get; set; }

    public double? TotalRating { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual CategoryProduct Cate { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<EventDetail> EventDetails { get; set; } = new List<EventDetail>();

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<RatingProduct> RatingProducts { get; set; } = new List<RatingProduct>();

    public virtual ICollection<ReturnProductDetail> ReturnProductDetails { get; set; } = new List<ReturnProductDetail>();

    public virtual ICollection<UseFor> UseFors { get; set; } = new List<UseFor>();
}
