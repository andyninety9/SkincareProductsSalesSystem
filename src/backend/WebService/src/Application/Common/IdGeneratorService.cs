using IdGen;

namespace Application.Common
{
    public class IdGeneratorService
    {
        private readonly IdGenerator _idGenerator;

        public IdGeneratorService()
        {
            var epoch = new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            _idGenerator = new IdGenerator(0, new IdGeneratorOptions(new IdStructure(41, 10, 12), new DefaultTimeSource(epoch)));
        }

        public long GenerateLongId()
        {
            return _idGenerator.CreateId();
        }

        public int GenerateIntId()
        {
            return (int)_idGenerator.CreateId();
        }
    }
}