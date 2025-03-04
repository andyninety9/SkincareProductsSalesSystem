using System;
using System.Linq;
using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class UpdateMeValidator : AbstractValidator<UpdateMeCommand>
    {
        public UpdateMeValidator()
        {
            // Validate Date of Birth (Dob) only if it is provided
            When(x => !string.IsNullOrEmpty(x.Dob), () =>
            {
                RuleFor(x => x.Dob)
                    .Must(date => DateTime.TryParseExact(date, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out _))
                    .WithMessage("Date of birth must be in ISO8601 format (yyyy-MM-dd)");
            });

            // Validate Gender only if it is provided
            When(x => !string.IsNullOrEmpty(x.Gender), () =>
            {
                RuleFor(x => x.Gender)
                    .Must(gender => new[] { "1", "2", "3" }.Contains(gender))
                    .WithMessage("Gender must be 1 -> Male, 2 -> Female, 3 -> Other");
            });

            // Validate PhoneNumber only if it is provided
            When(x => !string.IsNullOrEmpty(x.PhoneNumber), () =>
            {
                RuleFor(x => x.PhoneNumber)
                    .Matches(@"^(0|84|\+84)([3|5|7|8|9])([0-9]{8})$")
                    .WithMessage("Phone number must be in Vietnamese format (e.g., 0912345678, +84912345678, 84912345678)");
            });

            // Validate Fullname only if it is provided
            When(x => !string.IsNullOrEmpty(x.Fullname), () =>
            {
                RuleFor(x => x.Fullname)
                    .Length(3, 100)
                    .WithMessage("Fullname must be between 3 and 100 characters");
            });

            // Validate Email only if it is provided
            When(x => !string.IsNullOrEmpty(x.Email), () =>
            {
                RuleFor(x => x.Email)
                    .EmailAddress()
                    .WithMessage("Invalid email address");
            });
        }
    }
}