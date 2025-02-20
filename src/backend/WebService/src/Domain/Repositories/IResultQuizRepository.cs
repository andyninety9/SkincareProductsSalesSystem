using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.DTOs;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IResultQuizRepository : IRepository<ResultQuiz>
    {
        Task<long> CreateNewResultAsync(long quizId, long userId);
        Task SaveUserAnswerAsync(long resultId, int keyId);
        Task UpdateScoreAsync(long resultId, int score, string cateOldQuestion);
        Task<bool> IsTestCompleteAsync(long resultId);
        Task<int?> GetSkinTypeIdAsync(long resultId);
        Task<long> GetResultQuizIdByQuizIdAsync(long quizId);
        Task<GetQuizResultResponse> GetByQuizIdAsync(long quizId);
    }
}