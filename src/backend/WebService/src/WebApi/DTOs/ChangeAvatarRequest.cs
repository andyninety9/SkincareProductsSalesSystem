using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DTOs
{
    public class ChangeAvatarRequest
    {
        public IFormFile AvatarFile { get; set; }
    }
}