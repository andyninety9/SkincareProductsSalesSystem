using FluentValidation;
using Application.Features.Question.Commands;

namespace Application.Features.Question.Commands.Validator
{
    public class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand>
    {
        public UpdateQuestionCommandValidator()
        {
            RuleFor(x => x.QuestionId)
                .NotEmpty().WithMessage("QuestionId is required")
                .Must(id => id >= short.MinValue && id <= short.MaxValue)
                .WithMessage("QuestionId must be within the range of a short value.");

            RuleFor(x => x.CateQuestionId)
                .Must(id => id == null || (id >= short.MinValue && id <= short.MaxValue))
                .WithMessage("CateQuestionId must be within the range of a short value.");

            RuleFor(x => x.QuestionContent)
                .NotEmpty().When(x => x.QuestionContent != null)
                .WithMessage("QuestionContent, if provided, cannot be empty.");
        }
    }
}
