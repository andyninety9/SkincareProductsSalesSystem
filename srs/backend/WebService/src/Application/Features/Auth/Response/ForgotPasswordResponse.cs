using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Auth.Response
{
    public class ForgotPasswordResponse
    {
        public required string NewPasswordResetToken { get; set; }
        
    }
}