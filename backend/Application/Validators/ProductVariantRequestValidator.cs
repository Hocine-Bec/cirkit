using Application.DTOs.Product;
using FluentValidation;

namespace Application.Validators;

public class ProductVariantRequestValidator : AbstractValidator<ProductVariantRequest>
{
    public ProductVariantRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PriceModifier).GreaterThanOrEqualTo(0);
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
    }
}
