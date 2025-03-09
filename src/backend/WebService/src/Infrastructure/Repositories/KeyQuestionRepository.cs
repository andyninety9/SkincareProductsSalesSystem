using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class KeyQuestionRepository : Repository<KeyQuestion>, IKeyQuestionRepository
    {
        public KeyQuestionRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<KeyQuestion> GetKeyQuestionByKeyIdAsync(short keyId, CancellationToken cancellationToken)
        {
            return await _context.KeyQuestions.FirstOrDefaultAsync(x => x.KeyId == keyId, cancellationToken) 
                ?? throw new KeyNotFoundException($"KeyQuestion with KeyId {keyId} not found");
        }

        public Task<IEnumerable<KeyQuestion>> GetKeyQuestionByQuestionId(short questionId)
        {
            var result = _context.KeyQuestions.Where(x => x.QuestionId == questionId);
            return Task.FromResult(result.AsEnumerable());
            
        }
    }
}