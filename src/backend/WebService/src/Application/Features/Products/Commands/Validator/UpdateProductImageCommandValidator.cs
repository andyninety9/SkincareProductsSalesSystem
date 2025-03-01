using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Products.Commands.Validator
{
    public class UpdateProductImageCommandValidator: AbstractValidator<UploadProductImageUrlCommand>
    {
        public UpdateProductImageCommandValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("ProductId is required");
            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("ImageUrl is required")
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out var uriResult) && 
                      (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                .WithMessage("ImageUrl must be a valid HTTP or HTTPS URL");
        }
    }
}