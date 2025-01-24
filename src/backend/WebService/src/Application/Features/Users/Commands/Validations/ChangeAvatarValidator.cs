using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ChangeAvatarValidator: AbstractValidator<ChangeAvatarCommand>
    {
        public ChangeAvatarValidator()
        {
            RuleFor(x => x.AvatarFileData.Length)
                .LessThanOrEqualTo(15 * 1024 * 1024)
                .WithMessage("Image size must be less than 15MB");
        }
    }
}