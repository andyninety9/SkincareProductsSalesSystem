using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        Task<long> CreateNewQuizAsync(string quizName, string quizDesc);
        Task SaveUserAnswerAsync(long quizId, int questionId);
        Task<Quiz?> GetQuizByIdAsync(long quizId);
        Task<List<int>> GetAnsweredQuestionsAsync(long quizId);


    }
}