using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class AddressDto
    {
        public long AddressId { get; set; }
        public string Detail { get; set; } = string.Empty;
        // public bool IsDefault { get; set; }

    }
}