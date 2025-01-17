using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Constant
{
    public interface IConstantMessage
    {
        // Authentication related messages
        public static string EMAIL_ALREADY_EXISTS = "Email already exists";
        public static string LOGIN_SUCCESS = "Login success";
        public static string LOGIN_FALSE = "Login false";
        public static string REGISTER_SUCCESS = "Register success";
        public static string REGISTER_FALSE = "Register false";
        public static string REFRESH_TOKEN_SUCCESS = "Refresh token success";
        public static string INVALID_REFRESH_TOKEN = "Invalid refresh token";
        public static string LOGOUT_SUCCESS = "Logout success";
        public static string LOGOUT_FALSE = "Logout false";
        public static string VERIFY_EMAIL_SUCCESS = "Verify email success";
        public static string EMAIL_VERIFY_HAVE_BEEN_VERIFIED = "Email verify have been verified";
        public static string EMAIL_VERIFY_SUCCESS = "Email verify success";
        public static string EMAIL_VERIFY_FALSE = "Email verify false";









        // Validation related messages
        public static string INVALID_EMAIL = "Invalid email";
        public static string INVALID_PASSWORD = "Invalid password";
        public static string INVALID_EMAIL_OR_PASSWORD = "Invalid email or password";
        public static string DUPLICATED_USERNAME = "Duplicated username";
        public static string DUPLICATED_EMAIL = "Duplicated email";
        public static string DUPLICATED_PHONE_NUMBER = "Duplicated phone number";

        // Email related messages
        public static string EMAIL_VERIFICATION_SUCCESS = "Email verification success";
    }
}