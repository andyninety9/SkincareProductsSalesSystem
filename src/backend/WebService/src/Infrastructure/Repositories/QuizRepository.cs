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
    public class QuizRepository : Repository<Quiz>, IQuizRepository
    {
        public QuizRepository(MyDbContext context) : base(context)
        {
        }

        // ✅ 1. Tạo một bài quiz mới khi bắt đầu
        public async Task<long> CreateNewQuizAsync(string quizName, string quizDesc)
        {
            var newQuiz = new Quiz
            {
                QuizName = quizName,
                QuizDesc = quizDesc,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            };

            await _context.Quizzes.AddAsync(newQuiz);
            await _context.SaveChangesAsync();

            return newQuiz.QuizId; // Trả về QuizId để sử dụng trong request tiếp theo
        }

        // ✅ 2. Lưu câu trả lời của người dùng vào QuizDetail
        public async Task SaveUserAnswerAsync(long quizId, int questionId)
        {
            var quizDetail = new QuizDetail
            {
                QuizId = quizId,
                QuestId = (short)questionId
            };

            await _context.QuizDetails.AddAsync(quizDetail);
            await _context.SaveChangesAsync();
        }

        // ✅ 3. Lấy thông tin bài quiz theo QuizId
        public async Task<Quiz?> GetQuizByIdAsync(long quizId)
        {
            return await _context.Quizzes
                .Include(q => q.QuizDetails)
                .Include(q => q.ResultQuizzes)
                .FirstOrDefaultAsync(q => q.QuizId == quizId);
        }

        // ✅ 4. Lấy danh sách câu hỏi đã trả lời để tránh lặp lại
        public async Task<List<int>> GetAnsweredQuestionsAsync(long quizId)
        {
            return await _context.QuizDetails
                .Where(qd => qd.QuizId == quizId)
                .Select(qd => (int)qd.QuestId)
                .ToListAsync();
        }
    }
}