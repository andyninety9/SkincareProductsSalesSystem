using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IResultQuizRepository : IRepository<ResultQuiz>
    {
        Task<long> CreateNewResultAsync(long quizId, long userId);
        Task SaveUserAnswerAsync(long resultId, int keyId);
        Task UpdateScoreAsync(long resultId, int osScore, int srScore, int pnScore, int wtScore);
        Task<bool> IsTestCompleteAsync(long resultId);
        Task<int?> GetSkinTypeIdAsync(long resultId);
        Task<long> GetResultQuizIdByQuizIdAsync(long quizId);
    }
}