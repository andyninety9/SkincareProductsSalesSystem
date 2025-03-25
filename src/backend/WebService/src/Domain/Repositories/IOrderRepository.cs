using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.DTOs;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IOrderRepository : IRepository<Order>
    {

        Task<(IEnumerable<GetAllOrdersResponse> Orders, int TotalCount)> GetAllUserOrdersHistoryByQueryAsync(
            long userId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken);
        Task<(IEnumerable<GetAllOrdersResponse> Orders, int TotalCount)> GetAllOrdersByQueryAsync(
            string? status,
            long? customerId,
            long? eventId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken);
        Task<OrderDetailResponse?> GetOrderByIdAsync(long orderId, CancellationToken cancellationToken);

        Task<Order?> NextStatusOrderAsync(long orderId, CancellationToken cancellationToken);
        Task<Order?> ReverseStatusOrderAsync(long orderId, CancellationToken cancellationToken);

        Task<GetSalesSummaryDto?> GetSalesSummaryAsync(DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken);
    }
}