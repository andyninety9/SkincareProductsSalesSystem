using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IQuestionRepository : IRepository<Question>
    {
        Task<List<Question>> GetQuestionsByCategoryAsync(int categoryId);
        Task<List<CategoryQuestion>> GetAllCategoriesAsync();
        Task<Question?> GetNextQuestionInCategoryAsync(int categoryId, long quizId);
        Task<Question?> GetQuestionByIdAsync(int questionId);
        Task<string> GetCateQuestionAsync(int questionId);
        Task<Question?> GetNextQuestionAsync(long quizId);
        Task<bool> DeleteByStatusAsync(short questionId);

    }
}