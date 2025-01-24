using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DTOs
{
    public class ChangeAvatarRequest
    {
        public required IFormFile AvatarFile { get; set; }
    }
}