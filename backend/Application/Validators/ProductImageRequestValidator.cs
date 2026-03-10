using Application.DTOs.Product;
using FluentValidation;

namespace Application.Validators;

public class ProductImageRequestValidator : AbstractValidator<ProductImageRequest>
{
    public ProductImageRequestValidator()
    {
        RuleFor(x => x.ImageUrl).NotEmpty().MaximumLength(500);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}
