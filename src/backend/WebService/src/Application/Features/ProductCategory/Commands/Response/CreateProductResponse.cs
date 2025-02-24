using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.ProductCategory.Commands.Response
{
    public class CreateProductResponse
    {
        public short CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool CategoryStatus { get; set; }
        
    }
}