using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Features.SkinTest.Queries.Validators
{
    public class GetQuizResultQueryValidator : AbstractValidator<GetQuizResultQuery>
    {
        public GetQuizResultQueryValidator()
        {
            RuleFor(x => x.UserId)
                .NotNull().WithMessage("User ID is required")
                .GreaterThan(0).WithMessage("User ID must be greater than 0");
            
            RuleFor(x => x.QuizId)
                .NotNull().WithMessage("Quiz ID is required")
                .GreaterThan(0).WithMessage("Quiz ID must be greater than 0");
        }
        
    }
}