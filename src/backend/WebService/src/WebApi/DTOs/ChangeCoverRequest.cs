using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DTOs
{
    public class ChangeCoverRequest
    {
        public required IFormFile CoverFile { get; set; }
    }
}