using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class AgeGroupCount
    {
        /// <summary>
        /// The age range group (e.g. "18-24", "25-34", "35-44", "45-54", "55+", "Unknown")
        /// </summary>
        public string AgeGroup { get; set; } = string.Empty;

        /// <summary>
        /// The number of users in this age group
        /// </summary>
        public int Count { get; set; }
    }
}