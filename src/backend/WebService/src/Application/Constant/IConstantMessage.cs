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
        public static string FORGOT_PASSWORD_EMAIL_SEND_FAILED = "Forgot password email send failed";
        public static string USER_NOT_FOUND = "User not found";
        public static string EMAIL_VERIFY_TOKEN_UPDATE_FAILED = "Email verify token update failed";
        public static string EMAIL_VERIFICATION_EXPIRED = "Email verification expired";
        public static string RESEND_VERIFY_EMAIL_SUCCESS = "Resend verify email success";
        public static string EMAIL_VERIFY_TOKEN_STILL_VALID = "Email verify token still valid";
        public static string FORGOT_PASSWORD_TOKEN_EXIST = "Forgot password token exist";
        public static string FORGOT_PASSWORD_TOKEN_GENERATE_FAILED = "Forgot password token generate failed";
        public static string FORGOT_PASSWORD_SUCCESS = "Forgot password success";

        // User related messages
        public static string USER_INFORMATION_NOT_FOUND = "User information not found in token";
        public static string MISSING_USER_ID = "Invalid or missing user ID in token.";
        public static string GET_ME_FALSE = "Cannot get user information";
        public static string GET_ME_SUCCESS = "Get user information success";
        public static string UPDATE_ME_FALSE = "Cannot update user information";
        public static string UPDATE_ME_SUCCESS = "Update user information success";
        public static string INVALID_GENDER_FORMAT = "Gender must be 1, 2 or 3";
        public static string CHANGE_AVATAR_SUCCESS = "Change avatar success";








        // Validation related messages
        public static string INVALID_EMAIL = "Invalid email";
        public static string INVALID_PASSWORD = "Invalid password";
        public static string INVALID_EMAIL_OR_PASSWORD = "Invalid email or password";
        public static string DUPLICATED_USERNAME = "Duplicated username";
        public static string DUPLICATED_EMAIL = "Duplicated email";
        public static string DUPLICATED_PHONE_NUMBER = "Duplicated phone number";

        // Email related messages
        public static string EMAIL_VERIFICATION_SUCCESS = "Email verification success";

        // Server related messages
        public static string INTERNAL_SERVER_ERROR = "Internal server error";
        public static string INTERNAL_SERVER_MEDIATOR_ERROR = "Internal server error: Mediator is not initialized.";
    }
}