using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        private readonly ILogger<QuestionRepository> _logger;
        public QuestionRepository(MyDbContext context, ILogger<QuestionRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public Task<List<CategoryQuestion>> GetAllCategoriesAsync()
        {
            return _context.CategoryQuestions.ToListAsync();
        }

        public async Task<List<Question>> GetQuestionsByCategoryAsync(int categoryId)
        {
            return await _context.Questions
                .Where(q => q.CateQuestionId == categoryId) // Lọc theo category
                .Include(q => q.KeyQuestions)
                .ToListAsync();
        }

        public async Task<Question?> GetNextQuestionAsync(long quizId)
        {
            _logger.LogInformation($"Fetching next question for quiz {quizId}");

            // ✅ 1. Lấy danh sách câu hỏi đã trả lời từ QuizDetail theo quizId
            var answeredQuestions = await _context.QuizDetails
                .Where(qd => qd.QuizId == quizId)
                .Select(qd => qd.QuestId)
                .ToListAsync();

            _logger.LogInformation($"Answered questions: {string.Join(", ", answeredQuestions)}");

            // ✅ 2. Xác định category tiếp theo
            var categories = new List<int> { 1, 2, 3, 4 }; // 4 nhóm tiêu chí O/D, S/R, P/N, W/T

            // Lấy category cuối cùng được hỏi
            var lastCategoryId = await _context.QuizDetails
                .Where(qd => qd.QuizId == quizId)
                .OrderByDescending(qd => qd.DetailId)
                .Select(qd => _context.Questions
                    .Where(q => q.QuestionId == qd.QuestId)
                    .Select(q => q.CateQuestionId)
                    .FirstOrDefault())
                .FirstOrDefaultAsync();

            // Xác định category tiếp theo theo vòng lặp 1 → 2 → 3 → 4
            var nextCategoryId = categories[(categories.IndexOf(lastCategoryId) + 1) % categories.Count];

            // ✅ 3. Kiểm tra xem còn câu hỏi nào chưa trả lời trong category tiếp theo không
            var nextQuestion = await _context.Questions
                .Where(q => q.CateQuestionId == nextCategoryId && !answeredQuestions.Contains(q.QuestionId))
                .Include(q => q.KeyQuestions)
                .OrderBy(q => q.QuestionId)
                .FirstOrDefaultAsync();

            if (nextQuestion == null)
            {
                _logger.LogWarning($"No more questions available in category {nextCategoryId}, switching category...");
                // Nếu không còn câu hỏi trong category tiếp theo, thử category khác
                foreach (var category in categories)
                {
                    nextQuestion = await _context.Questions
                        .Where(q => q.CateQuestionId == category && !answeredQuestions.Contains(q.QuestionId))
                        .Include(q => q.KeyQuestions)
                        .OrderBy(q => q.QuestionId)
                        .FirstOrDefaultAsync();

                    if (nextQuestion != null)
                    {
                        _logger.LogInformation($"Switching to category {category}");
                        break;
                    }
                }
            }

            if (nextQuestion == null)
            {
                _logger.LogWarning("No valid next question found in any category.");
                return null;
            }

            _logger.LogInformation($"Returning next question: {nextQuestion.QuestionId}");
            return nextQuestion;
        }


        public async Task<Question?> GetNextQuestionInCategoryAsync(int categoryId, long quizId)
        {
            _logger.LogInformation($"Fetching next question in category {categoryId} for quiz {quizId}");

            // ✅ 1. Lấy danh sách câu hỏi đã trả lời từ QuizDetail theo quizId
            var answeredQuestions = await _context.QuizDetails
                .Where(qd => qd.QuizId == quizId)
                .Select(qd => qd.QuestId)
                .ToListAsync();

            _logger.LogInformation($"Answered questions: {string.Join(", ", answeredQuestions)}");

            // ✅ 2. Kiểm tra xem còn câu hỏi nào chưa trả lời không
            var remainingQuestions = await _context.Questions
                .Where(q => q.CateQuestionId == categoryId &&
                            !answeredQuestions.Contains(q.QuestionId))
                .Include(q => q.KeyQuestions)
                .ToListAsync();

            if (!remainingQuestions.Any())
            {
                _logger.LogWarning($"No more questions available in category {categoryId}");
                return null; // Không còn câu hỏi nào trong category hiện tại
            }

            // ✅ 3. Chọn câu hỏi tiếp theo có KeyQuestions hợp lệ
            var nextQuestion = remainingQuestions
                .Where(q => q.KeyQuestions.Any()) // Đảm bảo câu hỏi có câu trả lời hợp lệ
                .OrderBy(q => q.QuestionId) // Sắp xếp để lấy câu hỏi có ID nhỏ nhất
                .FirstOrDefault();

            if (nextQuestion == null)
            {
                _logger.LogWarning($"No valid next question found in category {categoryId}");
                return null;
            }

            _logger.LogInformation($"Returning next question: {nextQuestion.QuestionId}");
            return nextQuestion;
        }


        public async Task<Question?> GetQuestionByIdAsync(int questionId)
        {
            return await _context.Questions
                .Include(q => q.KeyQuestions)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId);
        }

        public Task<string?> GetCateQuestionAsync(int questionId)
        {
            return _context.Questions
                .Where(q => q.QuestionId == questionId)
                .Select(q => q.CateQuestionId.ToString())
                .FirstOrDefaultAsync();
        }
    }
}