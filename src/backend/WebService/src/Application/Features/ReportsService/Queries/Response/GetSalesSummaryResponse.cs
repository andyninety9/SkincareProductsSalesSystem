using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.ReportsService.Queries.Response
{
    public class GetSalesSummaryResponse
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public long TotalProductsSold { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        // public List<PeriodSalesSummary> DailySales { get; set; }
        // public List<PeriodSalesSummary> MonthlySales { get; set; }

        // public List<ProductSalesSummary> TopSellingProducts { get; set; }

        // // Phân tích theo danh mục
        // public List<CategorySalesSummary> SalesByCategory { get; set; }

        // // Phân tích theo khách hàng
        // public CustomerSalesMetrics CustomerMetrics { get; set; }

        // // So sánh với kỳ trước
        // public ComparisonMetrics PreviousPeriodComparison { get; set; }
    }

    // public class PeriodSalesSummary
    // {
    //     public DateTime Date { get; set; }
    //     public decimal Revenue { get; set; }
    //     public int OrderCount { get; set; }
    //     public long ProductsSold { get; set; } // Thay int bằng long
    // }

    // public class ProductSalesSummary
    // {
    //     public long ProductId { get; set; } // Thay int bằng long
    //     public string ProductName { get; set; }
    //     public string ImageUrl { get; set; }
    //     public long QuantitySold { get; set; } // Thay int bằng long
    //     public decimal Revenue { get; set; }
    //     public decimal UnitPrice { get; set; }
    // }

    // public class CategorySalesSummary
    // {
    //     public long CategoryId { get; set; } // Thay int bằng long
    //     public string CategoryName { get; set; }
    //     public decimal Revenue { get; set; }
    //     public long ProductsSold { get; set; } // Thay int bằng long
    //     public decimal PercentageOfTotal { get; set; }
    // }

    // public class CustomerSalesMetrics
    // {
    //     public int NewCustomersCount { get; set; }
    //     public int ReturningCustomersCount { get; set; }
    //     public decimal NewCustomersRevenue { get; set; }
    //     public decimal ReturningCustomersRevenue { get; set; }
    //     public decimal AverageRevenuePerCustomer { get; set; }
    // }

    // public class ComparisonMetrics
    // {
    //     public decimal RevenueGrowth { get; set; } // Phần trăm
    //     public decimal OrderCountGrowth { get; set; } // Phần trăm
    //     public decimal AverageOrderValueGrowth { get; set; } // Phần trăm
    // }
}