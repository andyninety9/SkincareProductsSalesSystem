using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class KeyQuestionRepository : Repository<KeyQuestion>, IKeyQuestionRepository
    {
        public KeyQuestionRepository(MyDbContext context) : base(context)
        {
        }

        public Task<IEnumerable<KeyQuestion>> GetKeyQuestionByQuestionId(short questionId)
        {
            var result = _context.KeyQuestions.Where(x => x.QuestionId == questionId);
            return Task.FromResult(result.AsEnumerable());
            
        }
    }
}