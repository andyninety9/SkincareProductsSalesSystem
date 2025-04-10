using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IKeyQuestionRepository : IRepository<KeyQuestion>
    {
        Task<IEnumerable<KeyQuestion>> GetKeyQuestionByQuestionId(short questionId);
        Task<KeyQuestion> GetKeyQuestionByKeyIdAsync(short keyId, CancellationToken cancellationToken);
    }
}