using System;
using System.Collections.Generic;
using Domain.DTOs;

namespace Application.Features.Products.Response
{
    public class GetAllProductsResponse
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string? ProductDesc { get; set; }
        public int Stocks { get; set; }
        public double CostPrice { get; set; }
        public double SellPrice { get; set; }
        public double? TotalRating { get; set; }
        public string Ingredient { get; set; } = null!;
        public string Instruction { get; set; } = null!;
        public string? ProdUseFor { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // **Thông tin liên quan**
        public string BrandName { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public string StatusName { get; set; } = null!;

        // **Danh sách ảnh sản phẩm**
        public List<ProductImageDto> Images { get; set; } = new();

        // **Số lượng đánh giá**
        public int ReviewCount { get; set; }
    }
}
