using Application.DTOs.Category;
using Application.DTOs.Customer;
using Application.DTOs.Order;
using Application.DTOs.Product;
using Application.DTOs.Review;
using Domain.Entities;
using Domain.Enums;
using Mapster;

namespace Application.Mappers;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        // Category
        TypeAdapterConfig<CategoryRequest, Category>.NewConfig();
        TypeAdapterConfig<Category, CategoryResponse>.NewConfig()
            .Map(dest => dest.ProductCount, src => src.Products != null ? src.Products.Count : 0);

        // Product
        TypeAdapterConfig<ProductRequest, Product>.NewConfig();
        TypeAdapterConfig<Product, ProductResponse>.NewConfig()
            .Map(dest => dest.CategoryName, src => src.Category != null ? src.Category.Name : string.Empty)
            .Map(dest => dest.AverageRating, src => src.Reviews != null && src.Reviews.Any() ? src.Reviews.Average(r => r.Rating) : 0)
            .Map(dest => dest.ReviewCount, src => src.Reviews != null ? src.Reviews.Count : 0);
        TypeAdapterConfig<Product, ProductDetailResponse>.NewConfig()
            .Map(dest => dest.CategoryName, src => src.Category != null ? src.Category.Name : string.Empty)
            .Map(dest => dest.AverageRating, src => src.Reviews != null && src.Reviews.Any() ? src.Reviews.Average(r => r.Rating) : 0)
            .Map(dest => dest.ReviewCount, src => src.Reviews != null ? src.Reviews.Count : 0);

        // Product Image
        TypeAdapterConfig<ProductImageRequest, ProductImage>.NewConfig();
        TypeAdapterConfig<ProductImage, ProductImageResponse>.NewConfig();

        // Product Variant
        TypeAdapterConfig<ProductVariantRequest, ProductVariant>.NewConfig();
        TypeAdapterConfig<ProductVariant, ProductVariantResponse>.NewConfig();

        // Customer
        TypeAdapterConfig<Customer, CustomerResponse>.NewConfig()
            .Map(dest => dest.OrderCount, src => src.Orders != null ? src.Orders.Count : 0)
            .Map(dest => dest.TotalSpent, src => src.Orders != null
                ? src.Orders
                    .Where(o => o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Refunded)
                    .Sum(o => o.Total)
                : 0);

        // Address
        TypeAdapterConfig<AddressRequest, Address>.NewConfig();
        TypeAdapterConfig<Address, AddressResponse>.NewConfig();

        // Order
        TypeAdapterConfig<Order, OrderResponse>.NewConfig()
            .Map(dest => dest.CustomerName, src => src.Customer != null
                ? $"{src.Customer.FirstName} {src.Customer.LastName}"
                : string.Empty)
            .Map(dest => dest.Status, src => src.Status.ToString())
            .Map(dest => dest.PaymentMethod, src => src.PaymentMethod.ToString())
            .Map(dest => dest.ItemCount, src => src.Items != null ? src.Items.Count : 0);
        TypeAdapterConfig<Order, OrderDetailResponse>.NewConfig()
            .Map(dest => dest.CustomerName, src => src.Customer != null
                ? $"{src.Customer.FirstName} {src.Customer.LastName}"
                : string.Empty)
            .Map(dest => dest.CustomerEmail, src => src.Customer != null ? src.Customer.Email : string.Empty)
            .Map(dest => dest.Status, src => src.Status.ToString())
            .Map(dest => dest.PaymentMethod, src => src.PaymentMethod.ToString());

        // OrderItem
        TypeAdapterConfig<OrderItem, OrderItemResponse>.NewConfig();

        // Review
        TypeAdapterConfig<Review, ReviewResponse>.NewConfig()
            .Map(dest => dest.CustomerName, src => src.Customer != null
                ? $"{src.Customer.FirstName} {src.Customer.LastName}"
                : string.Empty);
    }
}
