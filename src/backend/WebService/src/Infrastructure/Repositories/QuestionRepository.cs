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
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        public QuestionRepository(MyDbContext context) : base(context)
        {
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

        public async Task<Question?> GetNextQuestionInCategoryAsync(int categoryId, long quizId)
        {
            // ✅ 1. Lấy danh sách câu hỏi đã trả lời từ QuizDetail theo quizId
            var answeredQuestions = await _context.QuizDetails
                .Where(qd => qd.QuizId == quizId)
                .Select(qd => qd.QuestId)
                .ToListAsync();

            // ✅ 2. Lọc ra các câu hỏi chưa trả lời trong category hiện tại
            var nextQuestion = await _context.Questions
                .Where(q => q.CateQuestionId == categoryId && 
                           !answeredQuestions.Contains(q.QuestionId) &&
                           q.KeyQuestions.Any())
                .Include(q => q.KeyQuestions)
                .OrderBy(q => q.QuestionId)
                .FirstOrDefaultAsync();

            // ✅ 3. Nếu không còn câu hỏi trong category hiện tại, trả về null để chuyển sang category khác
            return nextQuestion;
        }

        public async Task<Question?> GetQuestionByIdAsync(int questionId)
        {
            return await _context.Questions
                .Include(q => q.KeyQuestions)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId);
        }
    }
}