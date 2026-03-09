using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(v => v.Name).IsRequired().HasMaxLength(200);
        builder.Property(v => v.Sku).IsRequired().HasMaxLength(100);
        builder.Property(v => v.PriceModifier).HasPrecision(10, 2);

        builder.HasIndex(v => v.Sku).IsUnique();
    }
}
