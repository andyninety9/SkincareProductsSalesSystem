using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Products.Commands.Response
{
    public class UpdateProductImageResponse
    {
        public long ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}