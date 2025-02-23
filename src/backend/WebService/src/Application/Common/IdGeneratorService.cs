using System;
using IdGen;

namespace Application.Common
{
    public class IdGeneratorService
    {
        private readonly IdGenerator _idGenerator;

        private static readonly object _lock = new object();
        private static long _lastTimeMs = 0;
        private static int _counter = 0;

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

        public short GenerateShortId()
        {
            lock (_lock)
            {
                long currentMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                if (currentMs != _lastTimeMs)
                {
                    _lastTimeMs = currentMs;
                    _counter = 0;
                }
                else
                {
                    _counter++;
                }

                int timePart = (int)(currentMs & 0x7F);
                int counterPart = _counter & 0xFF;

                int idValue = (timePart << 8) | counterPart;
                return (short)idValue;
            }
        }
    }
}
