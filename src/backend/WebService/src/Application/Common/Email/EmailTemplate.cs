using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Email
{
    public class EmailTemplate
    {
        public static string GenerateForgotPasswordEmailHtml(string username, string resetToken, string baseUrl)
        {
            string resetLink = $"{baseUrl}/reset-password?token={resetToken}";
            string emailHtml = $@"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Password Reset Request</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
            }}
            .content {{
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
            }}
            .button {{
                display: inline-block;
                margin: 20px 0;
                padding: 12px 24px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 5px;
                text-decoration: none;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 14px;
                color: #888888;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>Password Reset Request</div>
            <div class='content'>
                <p>Hello <strong>{username}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href='{resetLink}' class='button'>Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support.</p>
            </div>
            <div class='footer'>
                <p>This link will expire in 1 minute.</p>
                <p>Thank you,<br>Your App Team</p>
            </div>
        </div>
    </body>
    </html>";

            return emailHtml;
        }


        public static string GenerateEmailVerifyTokenHtml(string username, string verifyToken, string baseUrl)
        {
            string verifyLink = $"{baseUrl}/verify-email/{verifyToken}";
            string emailHtml = $@"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Email Verification</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
            }}
            .content {{
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
            }}
            .button {{
                display: inline-block;
                margin: 20px 0;
                padding: 12px 24px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 5px;
                text-decoration: none;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 14px;
                color: #888888;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>Email Verification</div>
            <div class='content'>
                <p>Hello <strong>{username}</strong>,</p>
                <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
                <a href='{verifyLink}' class='button'>Verify Email</a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p><a href='{verifyLink}'>{verifyLink}</a></p>
            </div>
            <div class='footer'>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>";

            return emailHtml;
        }

    }
}