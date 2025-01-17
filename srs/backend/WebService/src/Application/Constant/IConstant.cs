using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Constant
{
    public interface IConstant
    {
        public static int ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 3;
        public static int REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7;
        public static int EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES = 60 * 24;
    }
}