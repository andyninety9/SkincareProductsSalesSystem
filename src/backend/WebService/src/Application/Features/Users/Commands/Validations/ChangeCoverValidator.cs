using Application.Users.Commands;
using FluentValidation;

namespace Application.Features.Users.Commands.Validations
{
    public class ChangeCoverValidator: AbstractValidator<ChangeCoverCommand>
    {
        public ChangeCoverValidator()
        {
            RuleFor(x => x.CoverFileData)
                .NotEmpty()
                .Must(x => x != null && IsImage(x))
                .WithMessage("File must be an image (jpg, jpeg, png, gif)");

            RuleFor(x => x.CoverFileData.Length)
                .LessThanOrEqualTo(10 * 1024 * 1024)
                .WithMessage("Image size must be less than 10MB");
        }

        private bool IsImage(byte[] fileData)
        {
            if (fileData == null || fileData.Length < 4) return false;

            // Check file signatures
            var jpg = new byte[] { 255, 216, 255 };
            var png = new byte[] { 137, 80, 78, 71 };
            var gif = new byte[] { 71, 73, 70, 56 };

            return fileData.Take(3).SequenceEqual(jpg) ||
                   fileData.Take(4).SequenceEqual(png) ||
                   fileData.Take(4).SequenceEqual(gif);
        }
    }
}