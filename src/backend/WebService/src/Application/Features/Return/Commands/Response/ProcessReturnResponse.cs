using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Return.Commands.Response
{
    public class ProcessReturnResponse
    {
        public long ReturnId { get; set; } 
        public string Message { get; set; } = string.Empty;
    }
}