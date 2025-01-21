using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.ResponseModel;

namespace Application.Accounts.Response
{
    public class RegisterResponse
    {
        public RegisterResponse()
        {
        }

        public required string EmailVerifyToken { get; set; }
        public List<Error> Errors { get; set; } = new List<Error>();
    }
}