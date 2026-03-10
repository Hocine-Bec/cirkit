using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
        builder.Property(o => o.SubTotal).HasPrecision(10, 2);
        builder.Property(o => o.ShippingCost).HasPrecision(10, 2);
        builder.Property(o => o.Tax).HasPrecision(10, 2);
        builder.Property(o => o.Total).HasPrecision(10, 2);
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.PaymentMethod).HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.StripePaymentIntentId).HasMaxLength(200);
        builder.Property(o => o.StripeStatus).HasMaxLength(50);
        builder.Property(o => o.ShippingAddressSnapshot).HasColumnType("text");
        builder.Property(o => o.Notes).HasMaxLength(1000);

        builder.HasIndex(o => o.OrderNumber).IsUnique();

        builder.HasMany(o => o.Items)
               .WithOne(i => i.Order)
               .HasForeignKey(i => i.OrderId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
