using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ChangeStatusOrderRequest
    {
        public string Note { get; set; } = string.Empty;
    }
}