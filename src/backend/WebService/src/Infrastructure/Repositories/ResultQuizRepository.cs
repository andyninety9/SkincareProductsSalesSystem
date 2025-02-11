using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ResultQuizRepository : Repository<ResultQuiz>, IResultQuizRepository
    {
        public ResultQuizRepository(MyDbContext context) : base(context)
        {
        }
        public async Task<long> CreateNewResultAsync(long quizId, long userId)
        {
            var newResult = new ResultQuiz
            {
                QuizId = quizId,
                UsrId = userId,
                Odscore = 0,
                Srscore = 0,
                Pnpscore = 0,
                Wtscore = 0,
                CreateAt = DateTime.UtcNow,
                IsDefault = false
            };

            await _context.ResultQuizzes.AddAsync(newResult);
            await _context.SaveChangesAsync();

            return newResult.ResultId;
        }

        public async Task SaveUserAnswerAsync(long resultId, int keyId)
        {
            var resultDetail = new ResultDetail
            {
                ResultId = resultId,
                KeyId = (short)keyId
            };

            await _context.ResultDetails.AddAsync(resultDetail);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateScoreAsync(long resultId, int osScore, int srScore, int pnScore, int wtScore)
        {
            var result = await _context.ResultQuizzes.FindAsync(resultId);
            if (result != null)
            {
                result.Odscore = (short)(result.Odscore + osScore);
                result.Srscore = (short)(result.Srscore + srScore);
                result.Pnpscore = (short)(result.Pnpscore + pnScore);
                result.Wtscore = (short)(result.Wtscore + wtScore);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsTestCompleteAsync(long resultId)
        {
            var result = await _context.ResultQuizzes.FindAsync(resultId);
            if (result == null) return false;

            int totalScore = result.Odscore + result.Srscore + result.Pnpscore + result.Wtscore;
            return totalScore > 0 && (
                (result.Odscore >= totalScore * 0.6) ||
                (result.Srscore >= totalScore * 0.6) ||
                (result.Pnpscore >= totalScore * 0.6) ||
                (result.Wtscore >= totalScore * 0.6)
            );
        }

        public async Task<int?> GetSkinTypeIdAsync(long resultId)
        {
            var result = await _context.ResultQuizzes.FindAsync(resultId);
            if (result == null) return null;

            var skinType = await _context.SkinTypes.FirstOrDefaultAsync(st =>
                (result.Odscore > result.Srscore ? st.SkinTypeCodes.Contains("O") : st.SkinTypeCodes.Contains("D")) &&
                (result.Srscore > result.Odscore ? st.SkinTypeCodes.Contains("S") : st.SkinTypeCodes.Contains("R")) &&
                (result.Pnpscore > result.Wtscore ? st.SkinTypeCodes.Contains("P") : st.SkinTypeCodes.Contains("N")) &&
                (result.Wtscore > result.Pnpscore ? st.SkinTypeCodes.Contains("W") : st.SkinTypeCodes.Contains("T"))
            );

            if (skinType != null)
            {
                result.SkinTypeId = skinType.SkinTypeId;
                await _context.SaveChangesAsync();
                return skinType.SkinTypeId;
            }

            return null;
        }
    }
}