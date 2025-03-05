using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.Return.Queries.Validator
{
    public class GetAllReturnByCustomerCommandValidator : AbstractValidator<GetAllReturnByCustomerCommand>
    {
        public GetAllReturnByCustomerCommandValidator()
        {
            RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Customer Id is required")
            .GreaterThan(0).WithMessage("Customer Id must be greater than 0");

            RuleFor(x => x.PaginationParams)
            .NotNull().WithMessage("Pagination parameters are required");

            RuleFor(x => x.PaginationParams.Page)
            .GreaterThan(0).WithMessage("Page number must be greater than 0")
            .When(x => x.PaginationParams != null);

            RuleFor(x => x.PaginationParams.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100")
            .When(x => x.PaginationParams != null);
        }
        
    }
}