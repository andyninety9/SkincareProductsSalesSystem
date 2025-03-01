using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ProductImageDto
    {
        public long ProdImageId { get; set; }
        public string ProdImageUrl { get; set; } = null!;
        
    }
}