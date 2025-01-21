using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Auth.Response
{
    public class ResendEmailVerifyResponse
    {
        public required string NewEmailVerifyToken { get; set; }

        
    }
}