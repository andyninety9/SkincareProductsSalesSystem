using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Application.Abstractions.AWS;
using Domain.Entities;

namespace Infrastructure.AWS
{
    public class AwsSesEmailService : IEmailService
    {
        private readonly IAmazonSimpleEmailService _sesClient;
        public AwsSesEmailService(IAmazonSimpleEmailService sesClient) 
        {
            _sesClient = sesClient;
        }

        public async Task SendEmailAsync(EmailModel email)
        {
            var sendRequest = new SendEmailRequest
            {
                Source = email.From,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { email.To }
                },
                Message = new Message
                {
                    Subject = new Content(email.Subject),
                    Body = new Body
                    {
                        Html = new Content(email.Body)
                    }
                }
            };

            await _sesClient.SendEmailAsync(sendRequest);
        }
    }
}