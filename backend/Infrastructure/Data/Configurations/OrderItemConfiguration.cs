using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(i => i.ProductName).IsRequired().HasMaxLength(300);
        builder.Property(i => i.VariantName).HasMaxLength(200);
        builder.Property(i => i.UnitPrice).HasPrecision(10, 2);
        builder.Property(i => i.Total).HasPrecision(10, 2);

        builder.HasOne(i => i.Product)
               .WithMany(p => p.OrderItems)
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.ProductVariant)
               .WithMany()
               .HasForeignKey(i => i.ProductVariantId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
