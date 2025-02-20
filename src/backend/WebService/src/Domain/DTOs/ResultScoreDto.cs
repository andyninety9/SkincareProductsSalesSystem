using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ResultScoreDto
    {
        public short Odscore { get; set; }

        /// <summary>
        /// SensitiveResistantScore
        /// </summary>
        public short Srscore { get; set; }

        /// <summary>
        /// PigmentedNonPigmentedScore
        /// </summary>
        public short Pnpscore { get; set; }

        /// <summary>
        /// WrinkledTightScore
        /// </summary>
        public short Wtscore { get; set; }
    }
}