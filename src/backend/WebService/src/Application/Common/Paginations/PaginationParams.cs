using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Paginations
{
    public class PaginationParams
    {
        public int Page { get; set; } = 1;       
        public int PageSize { get; set; } = 10;  

        public int GetSkipCount()
        {
            return (Page - 1) * PageSize;
        }
    }
}