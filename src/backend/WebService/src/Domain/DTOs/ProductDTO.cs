using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.DTOs
{
    public class ProductDTO
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

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    }
}