using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{

    public class ResultQuizRepository : Repository<ResultQuiz>, IResultQuizRepository
    {
        private readonly ILogger<ResultQuizRepository> _logger;
        private readonly IMapper _mapper;
        public ResultQuizRepository(MyDbContext context, ILogger<ResultQuizRepository> logger, IMapper mapper) : base(context)
        {
            _logger = logger;
            _mapper = mapper;
        }
        public async Task<long> CreateNewResultAsync(long quizId, long userId)
        {
            // ✅ 1. Tìm tất cả kết quả cũ của người dùng và quizId
            var existingResults = await _context.ResultQuizzes
                .Where(r => r.UsrId == userId && r.IsDefault)
                .ToListAsync();

            if (existingResults.Any())
            {
                // ✅ 2. Cập nhật tất cả kết quả cũ thành IsDefault = false
                foreach (var result in existingResults)
                {
                    result.IsDefault = false;
                }

                await _context.SaveChangesAsync(); // ✅ Lưu thay đổi trước khi tạo kết quả mới
            }

            // ✅ 3. Tạo kết quả mới với IsDefault = true
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

        public async Task<GetQuizResultResponse> GetByQuizIdAsync(long quizId)
        {
            _logger.LogInformation("Fetching quiz result for QuizId: {QuizId}", quizId);

            // ✅ 1. Truy vấn `ResultQuiz` với `SkinType`, `TreatmentSolutions` và `RecommendFors`
            var resultQuiz = await _context.ResultQuizzes
    .AsNoTracking()
    .Include(r => r.SkinType)
        .ThenInclude(st => st.TreatmentSolutions)
    .Include(r => r.SkinType)
        .ThenInclude(st => st.RecommendFors)
            .ThenInclude(rf => rf.Prod) // ✅ Đảm bảo lấy dữ liệu từ bảng Product
    .Where(r => r.QuizId == quizId)
    .OrderByDescending(r => r.CreateAt)
    .FirstOrDefaultAsync();

            if (resultQuiz == null)
            {
                _logger.LogError("No quiz result found for QuizId: {QuizId}", quizId);
                throw new KeyNotFoundException($"No quiz result found for QuizId {quizId}.");
            }

            var skinType = resultQuiz.SkinType;
            if (skinType == null)
            {
                _logger.LogWarning("QuizId {QuizId} has no associated SkinType.", quizId);
                throw new KeyNotFoundException($"No SkinType found for QuizId {quizId}.");
            }

            // ✅ 2. Lấy liệu trình chăm sóc da nếu có
            string treatmentSolution = skinType.TreatmentSolutions?.FirstOrDefault()?.SolutionContent ?? "No treatment solution available.";

            // ✅ 3. Lấy danh sách sản phẩm khuyến nghị
            var recommendedProducts = await _context.RecommendFors
    .Where(r => r.SkinTypeId == skinType.SkinTypeId)
    .Include(r => r.Prod)
        .ThenInclude(p => p.ProductImages) // ✅ Load danh sách ảnh
    .Select(r => new ProductDTO
    {
        ProductId = r.Prod.ProductId,
        ProductName = r.Prod.ProductName,
        ProductDesc = r.Prod.ProductDesc,
        SellPrice = r.Prod.SellPrice,
        Ingredient = r.Prod.Ingredient,
        Instruction = r.Prod.Instruction,
        CateId = r.Prod.CateId,
        ProductImages = r.Prod.ProductImages.ToList() // ✅ Load danh sách ảnh sản phẩm
    })
    .ToListAsync();


            // ✅ 4. Phân loại sản phẩm theo từng bước chăm sóc da
            var recommendedProductsStep1 = recommendedProducts.Where(p => p.CateId == 1).ToList(); // Step 1: Làm sạch
            var recommendedProductsStep2 = recommendedProducts.Where(p => p.CateId == 2).ToList(); // Step 2: Dưỡng ẩm
            var recommendedProductsStep3 = recommendedProducts.Where(p => p.CateId == 11).ToList(); // Step 3: Bảo vệ

            // ✅ 5. Tạo response
            var response = new GetQuizResultResponse
            {
                ResultId = resultQuiz.ResultId,
                QuizId = resultQuiz.QuizId,
                UsrId = resultQuiz.UsrId,
                ResultScore = new ResultScoreDto
                {
                    Odscore = resultQuiz.Odscore,
                    Pnpscore = resultQuiz.Pnpscore,
                    Srscore = resultQuiz.Srscore,
                    Wtscore = resultQuiz.Wtscore
                },
                SkinTypeCode = skinType.SkinTypeCodes ?? "Unknown",
                SkinTypeName = skinType.SkinTypeName ?? "Unknown",
                SkinTypeDesc = skinType.SkinTypeDesc ?? "No description available.",
                TreatmentSolution = treatmentSolution,
                Cleansers = recommendedProductsStep1,
                Toners = recommendedProductsStep2,
                Moisturizers = recommendedProductsStep3,
                IsDefault = resultQuiz.IsDefault,
                CreateAt = resultQuiz.CreateAt
            };

            _logger.LogInformation("Successfully fetched quiz result for QuizId: {QuizId}", quizId);
            return response;
        }

    }
}