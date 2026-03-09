using Application.DTOs.Review;
using FluentValidation;

namespace Application.Validators;

public class ReviewRequestValidator : AbstractValidator<ReviewRequest>
{
    public ReviewRequestValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(2000);
    }
}
