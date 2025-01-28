using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Paginations
{
    public class PagedResult<T>
    {
        public required List<T> Items { get; set; }          
        public int TotalItems { get; set; }         
        public int Page { get; set; }               
        public int PageSize { get; set; }           

        public int TotalPages =>
            (int)Math.Ceiling((double)TotalItems / PageSize);

        public bool HasNextPage => Page < TotalPages;  
        public bool HasPreviousPage => Page > 1;       
    }
}