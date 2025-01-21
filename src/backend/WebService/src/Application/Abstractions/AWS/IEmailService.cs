using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Abstractions.AWS
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailModel email);
    }
}