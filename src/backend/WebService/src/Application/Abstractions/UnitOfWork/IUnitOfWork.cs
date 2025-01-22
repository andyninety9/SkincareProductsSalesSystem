using System;
using System.Threading;
using System.Threading.Tasks;
using Domain.Common;
using Microsoft.EntityFrameworkCore.Storage;

namespace Application.Abstractions.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        // Phương thức để lấy repository
        IRepository<T> Repository<T>() where T : class;

        // Phương thức lưu thay đổi vào database
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        // Phương thức bắt đầu transaction
        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);

        // Phương thức commit transaction
        Task CommitAsync(CancellationToken cancellationToken = default);

        // Phương thức rollback transaction
        Task RollbackAsync(CancellationToken cancellationToken = default);

        IExecutionStrategy CreateExecutionStrategy();
    }
}