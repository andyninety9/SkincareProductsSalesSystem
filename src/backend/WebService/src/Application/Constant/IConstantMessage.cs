using System;

namespace Application.Constant
{
    public interface IConstantMessage
    {
        // Authentication related messages
        public static string EMAIL_ALREADY_EXISTS = "This email is already registered.";
        public static string LOGIN_SUCCESS = "Login was successful.";
        public static string LOGIN_FALSE = "Login failed. Please check your credentials.";
        public static string REGISTER_SUCCESS = "Registration was successful.";
        public static string REGISTER_FALSE = "Registration failed. Please try again.";
        public static string REFRESH_TOKEN_SUCCESS = "Token has been refreshed successfully.";
        public static string INVALID_REFRESH_TOKEN = "The refresh token is invalid or expired.";
        public static string LOGOUT_SUCCESS = "You have been logged out successfully.";
        public static string LOGOUT_FALSE = "Logout failed. Please try again.";
        public static string VERIFY_EMAIL_SUCCESS = "Your email has been successfully verified.";
        public static string EMAIL_VERIFY_HAVE_BEEN_VERIFIED = "This email has already been verified.";
        public static string EMAIL_VERIFY_SUCCESS = "Email verification completed successfully.";
        public static string EMAIL_VERIFY_FALSE = "Email verification failed.";
        public static string FORGOT_PASSWORD_EMAIL_SEND_FAILED = "Unable to send the password reset email.";
        public static string USER_NOT_FOUND = "No user found with the provided information.";
        public static string EMAIL_VERIFY_TOKEN_UPDATE_FAILED = "Failed to update the email verification token.";
        public static string EMAIL_VERIFICATION_EXPIRED = "The email verification token has expired.";
        public static string RESEND_VERIFY_EMAIL_SUCCESS = "Verification email has been resent successfully.";
        public static string EMAIL_VERIFY_TOKEN_STILL_VALID = "The email verification token is still valid.";
        public static string FORGOT_PASSWORD_TOKEN_EXIST = "A valid password reset token already exists.";
        public static string FORGOT_PASSWORD_TOKEN_GENERATE_FAILED = "Unable to generate a new password reset token.";
        public static string FORGOT_PASSWORD_SUCCESS = "Your password has been reset successfully.";
        public static string ACCOUNT_IS_LOCKED = "Your account has been banned.";
        public static string ACCOUNT_ACTIVE_ALREADY = "Your account is already active.";
        public static string INVALID_GOOGLE_ID_TOKEN = "The provided Google ID Token is invalid.";

        // User related messages
        public static string USER_INFORMATION_NOT_FOUND = "User information is missing in the token.";
        public static string MISSING_USER_ID = "The user ID is invalid or missing in the token.";
        public static string GET_ME_FALSE = "Unable to retrieve user information.";
        public static string GET_ME_SUCCESS = "User information retrieved successfully.";
        public static string UPDATE_ME_FALSE = "Failed to update user information.";
        public static string UPDATE_ME_SUCCESS = "User information updated successfully.";
        public static string INVALID_GENDER_FORMAT = "Gender value must be 1, 2, or 3.";
        public static string CHANGE_AVATAR_SUCCESS = "Avatar updated successfully.";
        public static string AVATAR_FILE_INVALID = "The provided avatar file is invalid.";
        public static string COVER_FILE_INVALID = "The provided cover file is invalid.";
        public static string FILE_UPLOAD_FALSE_ON_S3 = "Failed to upload the file to S3.";
        public static string UPLOAD_FILE_FALSE = "File upload failed.";
        public static string PHONE_NUMBER_EXISTED = "The provided phone number is already registered.";
        public static string CHANGE_PASSWORD_SUCCESS = "Password has been changed successfully.";
        public static string CHANGE_PASSWORD_FALSE = "Failed to change the password.";

        // Validation related messages
        public static string INVALID_EMAIL = "The provided email is invalid.";
        public static string INVALID_PASSWORD = "The provided password is invalid.";
        public static string INVALID_EMAIL_OR_PASSWORD = "The email or password is invalid.";
        public static string DUPLICATED_USERNAME = "The username is already in use.";
        public static string DUPLICATED_EMAIL = "The email is already in use.";
        public static string DUPLICATED_PHONE_NUMBER = "The phone number is already in use.";

        // Email related messages
        public static string EMAIL_VERIFICATION_SUCCESS = "Email has been successfully verified.";

        // Server related messages
        public static string INTERNAL_SERVER_ERROR = "An unexpected error occurred on the server.";
        public static string INTERNAL_SERVER_MEDIATOR_ERROR = "An error occurred: Mediator is not initialized.";
    }
}
