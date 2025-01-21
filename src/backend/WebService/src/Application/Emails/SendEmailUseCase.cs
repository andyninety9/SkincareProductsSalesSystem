using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.AWS;
using Domain.Entities;

namespace Application.Emails
{
    public class SendEmailUseCase
    {
        private readonly IEmailService _emailService;
        public SendEmailUseCase(IEmailService emailService)
        {
            _emailService = emailService;
        }
        public async Task ExecuteAsync(EmailModel email)
        {
            if (string.IsNullOrEmpty(email.To) || string.IsNullOrEmpty(email.Subject))
            {
                throw new ArgumentException("Email To and Subject cannot be empty");
            }

            await _emailService.SendEmailAsync(email);
        }
    }
}