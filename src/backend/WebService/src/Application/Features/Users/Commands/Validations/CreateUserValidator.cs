using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class CreateUserValidator: AbstractValidator<CreateUserCommand>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.Email).NotEmpty().MaximumLength(70).EmailAddress().WithMessage("Email is invalid format");
            RuleFor(x => x.Username).NotEmpty().MaximumLength(50).WithMessage("Username must be less than 50 characters");
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(15).WithMessage("Phone must be less than 15 characters");
            RuleFor(x => x.Fullname).NotEmpty().MaximumLength(50).WithMessage("Fullname must be less than 50 characters");
            RuleFor(x => x.RoleId).NotEmpty().WithMessage("RoleId is required");
        }
        
    }
}