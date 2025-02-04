using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Product
{
    public long ProductId { get; set; }

    public short CateId { get; set; }

    public long BrandId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? ProductDesc { get; set; }

    public int Stocks { get; set; }

    public double CostPrice { get; set; }

    public double SellPrice { get; set; }

    public double? TotalRating { get; set; }

    public string Ingredient { get; set; } = null!;

    public string Instruction { get; set; } = null!;

    public short ProdStatusId { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual CategoryProduct Cate { get; set; } = null!;

    public virtual ICollection<EventDetail> EventDetails { get; set; } = new List<EventDetail>();

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ProductStatus ProdStatus { get; set; } = null!;

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<RecommendFor> RecommendFors { get; set; } = new List<RecommendFor>();

    public virtual ICollection<ReturnProductDetail> ReturnProductDetails { get; set; } = new List<ReturnProductDetail>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
