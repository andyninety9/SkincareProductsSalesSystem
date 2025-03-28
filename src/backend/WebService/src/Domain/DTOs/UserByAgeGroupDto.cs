using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserByAgeGroupDto
    {
        public List<AgeGroupCount> AgeGroups { get; set; } = new List<AgeGroupCount>();
    }
}