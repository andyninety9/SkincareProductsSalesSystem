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
                CreateAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                SkinTypeId = 1,
                IsDefault = true
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

        public async Task UpdateScoreAsync(long resultId, int score, string cateOldQuestion)
        {
            var result = await _context.ResultQuizzes.FindAsync(resultId);
            if (result == null)
            {
                throw new Exception($"ResultQuiz with ID {resultId} not found.");
            }

            // ✅ Cập nhật điểm đúng loại dựa trên `cateOldQuestion`
            switch (cateOldQuestion.ToUpper())
            {
                case "1": // Oily vs Dry
                    result.Odscore += (short)score;
                    break;
                case "2": // Sensitive vs Resistant
                    result.Srscore += (short)score;
                    break;
                case "3": // Pigmented vs Non-Pigmented
                    result.Pnpscore += (short)score;
                    break;
                case "4": // Wrinkled vs Tight
                    result.Wtscore += (short)score;
                    break;
                default:
                    throw new Exception($"Invalid cateOldQuestion: {cateOldQuestion}. Expected '1', '2', '3', or '4'.");
            }

            await _context.SaveChangesAsync();
        }



        public async Task<bool> IsTestCompleteAsync(long resultId)
        {
            var result = await _context.ResultQuizzes.FindAsync(resultId);
            if (result == null) return false;

            // ✅ 1. Tính tổng điểm từ tất cả nhóm loại da
            int totalScore = result.Odscore + result.Srscore + result.Pnpscore + result.Wtscore;
            if (totalScore == 0) return false; // Tránh lỗi chia cho 0

            // ✅ 2. Kiểm tra số câu đã trả lời
            int answeredQuestionsCount = await _context.ResultDetails
                .Where(rd => rd.ResultId == resultId)
                .CountAsync();

            // ✅ 3. Nếu đã trả lời tối thiểu 8 câu, kiểm tra nếu một nhóm đạt ≥ 60% tổng điểm
            bool isDominantCategory =
                (result.Odscore >= totalScore * 0.6) ||
                (result.Srscore >= totalScore * 0.6) ||
                (result.Pnpscore >= totalScore * 0.6) ||
                (result.Wtscore >= totalScore * 0.6);

            if (answeredQuestionsCount >= 8 && isDominantCategory) return true;

            // ✅ 4. Dừng nếu đã trả lời đủ 16 câu
            if (answeredQuestionsCount >= 16) return true;

            return false;
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

        public Task<long> GetResultQuizIdByQuizIdAsync(long quizId)
        {
            return _context.ResultQuizzes
                .Where(r => r.QuizId == quizId)
                .Select(r => r.ResultId)
                .FirstOrDefaultAsync();
        }
    }
}