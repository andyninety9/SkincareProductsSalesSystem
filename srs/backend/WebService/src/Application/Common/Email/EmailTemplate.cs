using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Email
{
    public class EmailTemplate
    {


        public static string GenerateEmailVerifyTokenHtml(string username, string verifyToken, string baseUrl)
        {
            return $@"
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                padding: 0;
                margin: 0;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                border: 1px solid #ffc0cb;
            }}
            .header {{
                background-color: #ffc0cb;
                color: white;
                text-align: center;
                padding: 20px;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }}
            .content {{
                padding: 20px;
            }}
            .content h2 {{
                color: #ff69b4;
            }}
            .button {{
                display: inline-block;
                background-color: #ff69b4;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 3px;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
            .footer p {{
                margin: 0;
            }}
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>
                <h1>Welcome to Mavid!</h1>
            </div>
            <div class='content'>
                <h2>Hello {username},</h2>
                <p>Thank you for registering with Mavid. To complete your registration, please verify your email address by clicking the button below:</p>
                <p style='text-align: center;'>
                    <a href='{baseUrl}/verify-email/{verifyToken}' class='button'>Verify Email</a>
                </p>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p>{baseUrl}/verify-email/{verifyToken}</p>
            </div>
            <div class='footer'>
                <p>This is an automated message from Mavid. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>";
        }

    }
}