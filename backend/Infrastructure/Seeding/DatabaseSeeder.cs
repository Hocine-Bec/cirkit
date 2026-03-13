using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Seeding;

/// <summary>
/// Seeds the database with comprehensive demo data on first run. Idempotent — skips if users already exist.
/// Default admin: admin@cirkit.com / Admin123!
/// 8 sample customers with orders, reviews, and addresses.
/// 90 products (15 per category), 270 images, 180 variants, 20 orders.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

        if (await context.Users.AnyAsync()) return;

        var now = DateTime.UtcNow;

        // ── Admin User ────────────────────────────────────────────────────────────
        var admin = new User
        {
            Id           = Guid.NewGuid(),
            FullName     = "CirKit Admin",
            Email        = "admin@cirkit.com",
            PasswordHash = authService.HashPassword("Admin123!"),
            Role         = UserRole.Admin,
            CreatedAt    = now
        };
        await context.Users.AddAsync(admin);

        // ── Categories ────────────────────────────────────────────────────────────
        var smartphones = new Category { Id = Guid.NewGuid(), Name = "Smartphones",  Slug = "smartphones",  Description = "Latest smartphones from top brands",           ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80", DisplayOrder = 1 };
        var laptops     = new Category { Id = Guid.NewGuid(), Name = "Laptops",      Slug = "laptops",      Description = "Powerful laptops for work and play",            ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80", DisplayOrder = 2 };
        var tablets     = new Category { Id = Guid.NewGuid(), Name = "Tablets",       Slug = "tablets",      Description = "Tablets for creativity and entertainment",      ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", DisplayOrder = 3 };
        var audio       = new Category { Id = Guid.NewGuid(), Name = "Audio",         Slug = "audio",        Description = "Premium headphones, earbuds, and speakers",     ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", DisplayOrder = 4 };
        var wearables   = new Category { Id = Guid.NewGuid(), Name = "Wearables",     Slug = "wearables",    Description = "Smartwatches and fitness trackers",             ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", DisplayOrder = 5 };
        var accessories = new Category { Id = Guid.NewGuid(), Name = "Accessories",   Slug = "accessories",  Description = "Cases, cables, chargers, and peripherals",      ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", DisplayOrder = 6 };

        await context.Categories.AddRangeAsync(smartphones, laptops, tablets, audio, wearables, accessories);
        await context.SaveChangesAsync();

        // ── Products ──────────────────────────────────────────────────────────────

        // ─── Smartphones (15) ─────────────────────────────────────────────────────
        var sp01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "iPhone 15 Pro Max", Slug = "iphone-15-pro-max",
            Description = "The most powerful iPhone ever. Featuring the A17 Pro chip built on 3-nanometer technology, a titanium design that's both incredibly strong and lightweight, and the most advanced camera system ever on an iPhone with a 48MP main camera, 12MP ultrawide, and 5x optical zoom telephoto.",
            ShortDescription = "A17 Pro chip, titanium design, 48MP camera, 5x optical zoom",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
            Brand = "Apple", Sku = "APL-IP15PM", StockQuantity = 50, IsFeatured = true,
            Specifications = "{\"Display\":\"6.7\\\" Super Retina XDR ProMotion\",\"Chip\":\"A17 Pro\",\"Camera\":\"48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto\",\"Battery\":\"29hr video playback\",\"OS\":\"iOS 17\",\"Weight\":\"221g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Samsung Galaxy S24 Ultra", Slug = "samsung-galaxy-s24-ultra",
            Description = "Galaxy AI is here. The Galaxy S24 Ultra features a built-in S Pen, a 200MP camera system, and the brightest display ever on a Galaxy phone. Powered by Snapdragon 8 Gen 3, it delivers unmatched performance for gaming, creativity, and productivity.",
            ShortDescription = "200MP camera, built-in S Pen, Snapdragon 8 Gen 3",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GS24U", StockQuantity = 40, IsFeatured = true,
            Specifications = "{\"Display\":\"6.8\\\" QHD+ AMOLED 120Hz\",\"Chip\":\"Snapdragon 8 Gen 3\",\"Camera\":\"200MP Main + 12MP Ultra Wide + 50MP 5x Telephoto\",\"Battery\":\"5000mAh 45W\",\"OS\":\"Android 14 / One UI 6.1\",\"Weight\":\"232g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Google Pixel 8 Pro", Slug = "google-pixel-8-pro",
            Description = "Meet the Pixel 8 Pro — Google's most advanced smartphone with the new Tensor G3 chip for on-device AI features. Features a 50MP triple camera system with Video Boost, Temperature Sensor, and up to 7 years of OS updates.",
            ShortDescription = "Tensor G3 chip, 50MP triple camera, 7 years of updates",
            BasePrice = 999.00m, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
            Brand = "Google", Sku = "GOO-PX8P", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Display\":\"6.7\\\" LTPO OLED 120Hz\",\"Chip\":\"Google Tensor G3\",\"Camera\":\"50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto\",\"Battery\":\"5050mAh 30W\",\"OS\":\"Android 14\",\"Weight\":\"213g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "OnePlus 12", Slug = "oneplus-12",
            Description = "The OnePlus 12 combines Snapdragon 8 Gen 3 performance with a Hasselblad-tuned triple camera system and 100W SUPERVOOC charging. Get from 0 to 100% in just 26 minutes, and enjoy a silky-smooth 2K display with 4500 nit peak brightness.",
            ShortDescription = "Snapdragon 8 Gen 3, Hasselblad camera, 100W fast charge",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
            Brand = "OnePlus", Sku = "OPL-12", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Display\":\"6.82\\\" 2K LTPO AMOLED 120Hz\",\"Chip\":\"Snapdragon 8 Gen 3\",\"Camera\":\"50MP Hasselblad Main + 48MP Ultra Wide + 64MP 3x Periscope\",\"Battery\":\"5400mAh 100W\",\"OS\":\"OxygenOS 14\",\"Weight\":\"220g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Xiaomi 14 Pro", Slug = "xiaomi-14-pro",
            Description = "The Xiaomi 14 Pro sets a new standard with its Leica-engineered Summilux optics. Powered by Snapdragon 8 Gen 3 with a variable aperture lens, ceramic body, and Xiaomi's HyperOS delivering a buttery-smooth experience.",
            ShortDescription = "Leica Summilux optics, variable aperture, Snapdragon 8 Gen 3",
            BasePrice = 899.00m, ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
            Brand = "Xiaomi", Sku = "XMI-14P", StockQuantity = 28, IsFeatured = false,
            Specifications = "{\"Display\":\"6.73\\\" 2K LTPO AMOLED 120Hz\",\"Chip\":\"Snapdragon 8 Gen 3\",\"Camera\":\"50MP Leica Summilux f/1.4-4.0 + 50MP Ultra Wide + 50MP 3.2x Telephoto\",\"Battery\":\"4880mAh 120W\",\"OS\":\"HyperOS\",\"Weight\":\"223g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Sony Xperia 1 VI", Slug = "sony-xperia-1-vi",
            Description = "Built for creators. The Xperia 1 VI features a 4K HDR OLED display, real-time Eye AF borrowed from Alpha cameras, and a dedicated cinema mode for professional-grade video recording at 4K 120fps.",
            ShortDescription = "4K HDR OLED display, Alpha camera tech, 4K 120fps video",
            BasePrice = 1399.00m, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
            Brand = "Sony", Sku = "SNY-X1VI", StockQuantity = 18, IsFeatured = false,
            Specifications = "{\"Display\":\"6.5\\\" 4K HDR OLED 120Hz\",\"Chip\":\"Snapdragon 8 Gen 3\",\"Camera\":\"48MP Exmor T Main + 12MP Ultra Wide + 12MP 5.2x Periscope\",\"Battery\":\"5000mAh 30W\",\"OS\":\"Android 14\",\"Weight\":\"192g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Samsung Galaxy Z Fold 5", Slug = "samsung-galaxy-z-fold-5",
            Description = "Unfold your world. The Galaxy Z Fold 5 features a slimmer hinge, Flex Mode for hands-free use, and a 7.6-inch main display that opens into a tablet-sized canvas. Multitask with up to three apps simultaneously.",
            ShortDescription = "7.6\" foldable display, slimmer hinge, tri-app multitasking",
            BasePrice = 1799.00m, ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GZF5", StockQuantity = 20, IsFeatured = true,
            Specifications = "{\"Display\":\"7.6\\\" QXGA+ Dynamic AMOLED 2X (inner) + 6.2\\\" HD+ (cover)\",\"Chip\":\"Snapdragon 8 Gen 2\",\"Camera\":\"50MP Main + 12MP Ultra Wide + 10MP 3x Telephoto\",\"Battery\":\"4400mAh 25W\",\"OS\":\"Android 14 / One UI 6.1\",\"Weight\":\"253g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Nothing Phone (2)", Slug = "nothing-phone-2",
            Description = "Nothing Phone (2) features the iconic Glyph Interface — a system of 33 LED zones on the transparent back that light up for notifications, timers, and visual feedback. Clean software, solid Snapdragon 8+ Gen 1 performance, and a refreshingly unique design.",
            ShortDescription = "Glyph LED interface, transparent design, Snapdragon 8+ Gen 1",
            BasePrice = 599.00m, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
            Brand = "Nothing", Sku = "NTH-PH2", StockQuantity = 25, IsFeatured = false,
            Specifications = "{\"Display\":\"6.7\\\" LTPO OLED 120Hz\",\"Chip\":\"Snapdragon 8+ Gen 1\",\"Camera\":\"50MP Main + 50MP Ultra Wide\",\"Battery\":\"4700mAh 45W\",\"OS\":\"Nothing OS 2.0\",\"Weight\":\"201g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Motorola Edge 50 Ultra", Slug = "motorola-edge-50-ultra",
            Description = "The Motorola Edge 50 Ultra packs a 50MP main camera with OIS, a stunning 6.7-inch pOLED display with 144Hz refresh rate, and wood or vegan leather back options. Featuring Moto AI for smart suggestions and TurboPower 125W charging.",
            ShortDescription = "144Hz pOLED, 125W TurboPower, wood/leather finishes",
            BasePrice = 699.00m, ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
            Brand = "Motorola", Sku = "MOT-E50U", StockQuantity = 22, IsFeatured = false,
            Specifications = "{\"Display\":\"6.7\\\" pOLED 144Hz\",\"Chip\":\"Snapdragon 8s Gen 3\",\"Camera\":\"50MP OIS Main + 50MP Ultra Wide + 64MP 3x Telephoto\",\"Battery\":\"4500mAh 125W\",\"OS\":\"Android 14 / My UX\",\"Weight\":\"197g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "ASUS ROG Phone 8 Pro", Slug = "asus-rog-phone-8-pro",
            Description = "The ultimate gaming phone. The ROG Phone 8 Pro features a Snapdragon 8 Gen 3 overclocked to 3.3GHz, AeroActive Cooler X for sustained performance, 165Hz Samsung AMOLED display, and programmable AirTrigger ultrasonic shoulder buttons.",
            ShortDescription = "Overclocked Snapdragon 8 Gen 3, 165Hz, AeroActive Cooler",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
            Brand = "ASUS", Sku = "ASU-ROG8P", StockQuantity = 15, IsFeatured = false,
            Specifications = "{\"Display\":\"6.78\\\" Samsung AMOLED 165Hz\",\"Chip\":\"Snapdragon 8 Gen 3 (OC 3.3GHz)\",\"Camera\":\"50MP Gimbal Main + 13MP Ultra Wide + 32MP 3x Telephoto\",\"Battery\":\"5500mAh 65W\",\"OS\":\"Android 14 / ROG UI\",\"Weight\":\"225g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "iPhone 15", Slug = "iphone-15",
            Description = "iPhone 15 brings the Dynamic Island to the entire lineup, along with a 48MP main camera, USB-C connectivity, and the powerful A16 Bionic chip. A beautiful design with color-infused glass and aluminum construction.",
            ShortDescription = "Dynamic Island, 48MP camera, USB-C, A16 Bionic",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
            Brand = "Apple", Sku = "APL-IP15", StockQuantity = 60, IsFeatured = false,
            Specifications = "{\"Display\":\"6.1\\\" Super Retina XDR OLED\",\"Chip\":\"A16 Bionic\",\"Camera\":\"48MP Main + 12MP Ultra Wide\",\"Battery\":\"20hr video playback\",\"OS\":\"iOS 17\",\"Weight\":\"171g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Samsung Galaxy A55", Slug = "samsung-galaxy-a55",
            Description = "Premium features at a mid-range price. The Galaxy A55 offers a Super AMOLED 120Hz display, triple camera system with OIS, IP67 water resistance, and Samsung's commitment to 4 years of OS updates and 5 years of security patches.",
            ShortDescription = "Super AMOLED 120Hz, IP67, 4 years OS updates",
            BasePrice = 449.00m, ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GA55", StockQuantity = 55, IsFeatured = false,
            Specifications = "{\"Display\":\"6.6\\\" Super AMOLED 120Hz\",\"Chip\":\"Exynos 1480\",\"Camera\":\"50MP OIS Main + 12MP Ultra Wide + 5MP Macro\",\"Battery\":\"5000mAh 25W\",\"OS\":\"Android 14 / One UI 6.1\",\"Weight\":\"213g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Google Pixel 8a", Slug = "google-pixel-8a",
            Description = "The best of Pixel, made for everyone. Pixel 8a features the Tensor G3 chip, a 64MP main camera with incredible low-light photography, and 7 years of OS and security updates — all at a more accessible price.",
            ShortDescription = "Tensor G3, 64MP camera, 7 years of updates, accessible price",
            BasePrice = 499.00m, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
            Brand = "Google", Sku = "GOO-PX8A", StockQuantity = 45, IsFeatured = false,
            Specifications = "{\"Display\":\"6.1\\\" OLED 120Hz\",\"Chip\":\"Google Tensor G3\",\"Camera\":\"64MP Main + 13MP Ultra Wide\",\"Battery\":\"4492mAh 18W\",\"OS\":\"Android 14\",\"Weight\":\"188g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Huawei Pura 70 Ultra", Slug = "huawei-pura-70-ultra",
            Description = "Huawei's flagship redefines mobile photography with a 1-inch XMAGE sensor, physically retractable camera lens, and advanced computational photography. The Kirin 9010 chip powers AI-enhanced photo processing for professional-level results.",
            ShortDescription = "1-inch XMAGE sensor, retractable lens, Kirin 9010",
            BasePrice = 1499.00m, ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
            Brand = "Huawei", Sku = "HUA-P70U", StockQuantity = 12, IsFeatured = false,
            Specifications = "{\"Display\":\"6.8\\\" LTPO OLED 120Hz\",\"Chip\":\"Kirin 9010\",\"Camera\":\"50MP 1-inch XMAGE Main + 40MP Ultra Wide + 50MP 3.5x Periscope\",\"Battery\":\"5200mAh 100W\",\"OS\":\"HarmonyOS 4.2\",\"Weight\":\"226g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var sp15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = smartphones.Id,
            Name = "Fairphone 5", Slug = "fairphone-5",
            Description = "The world's most sustainable smartphone. Fairphone 5 is modular, repairable, and built with fair-trade materials. Swap the battery, screen, and camera modules yourself. Comes with an 8-year software support commitment.",
            ShortDescription = "Modular & repairable, fair-trade materials, 8-year support",
            BasePrice = 649.00m, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
            Brand = "Fairphone", Sku = "FPH-5", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Display\":\"6.46\\\" OLED 90Hz\",\"Chip\":\"Qualcomm QCM6490\",\"Camera\":\"50MP Main + 50MP Ultra Wide\",\"Battery\":\"4200mAh 30W (replaceable)\",\"OS\":\"Android 13\",\"Weight\":\"212g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ─── Laptops (15) ─────────────────────────────────────────────────────────
        var lp01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "MacBook Pro 14\" M3 Pro", Slug = "macbook-pro-14-m3-pro",
            Description = "MacBook Pro with M3 Pro chip delivers extraordinary performance for demanding workflows. With up to 18-hour battery life, Liquid Retina XDR display, and up to 36GB of unified memory, it's the ultimate professional laptop.",
            ShortDescription = "M3 Pro chip, Liquid Retina XDR, up to 36GB unified memory",
            BasePrice = 1999.00m, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Brand = "Apple", Sku = "APL-MBP14-M3P", StockQuantity = 25, IsFeatured = true,
            Specifications = "{\"Display\":\"14.2\\\" Liquid Retina XDR 120Hz\",\"Chip\":\"Apple M3 Pro\",\"Memory\":\"18GB Unified (base)\",\"Storage\":\"512GB SSD (base)\",\"Battery\":\"Up to 18 hours\",\"Ports\":\"3x Thunderbolt 4, HDMI, SD, MagSafe\",\"Weight\":\"1.61kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Dell XPS 15", Slug = "dell-xps-15",
            Description = "The Dell XPS 15 combines stunning OLED display technology with Intel Core i7/i9 performance and NVIDIA GeForce RTX graphics. A near-borderless InfinityEdge display and precision-crafted aluminum chassis make it a premium Windows laptop.",
            ShortDescription = "OLED InfinityEdge display, Intel Core i7, NVIDIA RTX 4060",
            BasePrice = 1499.00m, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Brand = "Dell", Sku = "DEL-XPS15", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Display\":\"15.6\\\" 3.5K OLED 60Hz\",\"Processor\":\"Intel Core i7-13700H\",\"Memory\":\"16GB DDR5 (base)\",\"Storage\":\"512GB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4060 8GB\",\"Battery\":\"86Wh\",\"Weight\":\"1.86kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Lenovo ThinkPad X1 Carbon", Slug = "lenovo-thinkpad-x1-carbon",
            Description = "The ThinkPad X1 Carbon Gen 11 is the ultimate ultrabook for business. Under 1.12kg, MIL-SPEC tested, Intel Evo certified, with up to 15 hours battery life and the legendary ThinkPad keyboard.",
            ShortDescription = "Under 1.12kg, Intel Evo certified, 15hr battery, legendary keyboard",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
            Brand = "Lenovo", Sku = "LEN-X1C11", StockQuantity = 18, IsFeatured = false,
            Specifications = "{\"Display\":\"14\\\" 2.8K OLED 60Hz\",\"Processor\":\"Intel Core i7-1365U\",\"Memory\":\"16GB LPDDR5 (base)\",\"Storage\":\"512GB NVMe SSD\",\"Battery\":\"Up to 15 hours\",\"Weight\":\"1.12kg\",\"Certifications\":\"Intel Evo, MIL-SPEC 810H\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "ASUS ROG Zephyrus G16", Slug = "asus-rog-zephyrus-g16",
            Description = "The ROG Zephyrus G16 packs desktop-class gaming into an ultraportable chassis. Featuring an Intel Core Ultra 9 processor, NVIDIA RTX 4070 laptop GPU, a 16-inch 240Hz OLED display, and a CNC-milled aluminum body under 1.9kg.",
            ShortDescription = "RTX 4070, 240Hz OLED, Intel Core Ultra 9, under 1.9kg",
            BasePrice = 1899.00m, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Brand = "ASUS", Sku = "ASU-ROGZ16", StockQuantity = 14, IsFeatured = true,
            Specifications = "{\"Display\":\"16\\\" QHD+ OLED 240Hz\",\"Processor\":\"Intel Core Ultra 9 185H\",\"Memory\":\"16GB LPDDR5X\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4070 8GB\",\"Battery\":\"90Wh\",\"Weight\":\"1.85kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "HP Spectre x360 16", Slug = "hp-spectre-x360-16",
            Description = "The Spectre x360 16 is a premium 2-in-1 convertible with a 16-inch 4K OLED touchscreen, Intel Core Ultra 7 processor, and a gem-cut design in Nightfall Black. Includes HP MPP2.0 Tilt Pen for creative work.",
            ShortDescription = "4K OLED touchscreen, 2-in-1 convertible, Intel Core Ultra 7",
            BasePrice = 1699.00m, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
            Brand = "HP", Sku = "HP-SPX360-16", StockQuantity = 16, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" 4K OLED Touch 60Hz\",\"Processor\":\"Intel Core Ultra 7 155H\",\"Memory\":\"16GB LPDDR5X\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"Intel Arc Graphics\",\"Battery\":\"83Wh\",\"Weight\":\"2.04kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "MacBook Air 15\" M3", Slug = "macbook-air-15-m3",
            Description = "MacBook Air 15-inch with M3 chip delivers a spacious Liquid Retina display, all-day battery life up to 18 hours, and fanless silent operation. The world's thinnest 15-inch laptop — just 11.5mm thin.",
            ShortDescription = "M3 chip, 15\" Liquid Retina, 18hr battery, fanless, 11.5mm thin",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Brand = "Apple", Sku = "APL-MBA15-M3", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Display\":\"15.3\\\" Liquid Retina\",\"Chip\":\"Apple M3\",\"Memory\":\"8GB Unified (base)\",\"Storage\":\"256GB SSD (base)\",\"Battery\":\"Up to 18 hours\",\"Weight\":\"1.51kg\",\"Thickness\":\"11.5mm\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Razer Blade 16", Slug = "razer-blade-16",
            Description = "The Razer Blade 16 is the world's first dual-mode mini-LED display laptop — switch between 4K 120Hz for content creation and FHD 240Hz for competitive gaming. Powered by RTX 4080 and Intel Core i9-13950HX.",
            ShortDescription = "Dual-mode mini-LED display, RTX 4080, Core i9-13950HX",
            BasePrice = 2799.00m, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
            Brand = "Razer", Sku = "RZR-BLD16", StockQuantity = 10, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" mini-LED (4K 120Hz / FHD 240Hz)\",\"Processor\":\"Intel Core i9-13950HX\",\"Memory\":\"32GB DDR5\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4080 12GB\",\"Battery\":\"95.2Wh\",\"Weight\":\"2.4kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Framework Laptop 16", Slug = "framework-laptop-16",
            Description = "The modular, repairable laptop reimagined at 16 inches. Hot-swap your GPU, keyboard layout, ports, and even the bezel. Choose between AMD Radeon RX 7700S or no dGPU. Right to repair, built in.",
            ShortDescription = "Hot-swap GPU, modular ports, AMD Ryzen 7040, fully repairable",
            BasePrice = 1399.00m, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Brand = "Framework", Sku = "FWK-LP16", StockQuantity = 12, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" 2560x1600 IPS 165Hz\",\"Processor\":\"AMD Ryzen 7 7840HS\",\"Memory\":\"Up to 64GB DDR5 (user-installed)\",\"Storage\":\"User-installed NVMe\",\"GPU\":\"AMD Radeon RX 7700S (optional)\",\"Battery\":\"85Wh\",\"Weight\":\"2.1kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Lenovo Yoga Pro 9i", Slug = "lenovo-yoga-pro-9i",
            Description = "The Yoga Pro 9i features a mini-LED PureSight display with 1200 nits brightness and DCI-P3 100% coverage, perfect for color-critical creative work. Intel Core Ultra 9 and an NVIDIA RTX 4060 for demanding workflows.",
            ShortDescription = "Mini-LED PureSight display, Core Ultra 9, RTX 4060",
            BasePrice = 1799.00m, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
            Brand = "Lenovo", Sku = "LEN-YP9I", StockQuantity = 15, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" 3.2K mini-LED 165Hz\",\"Processor\":\"Intel Core Ultra 9 185H\",\"Memory\":\"32GB LPDDR5X\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4060 8GB\",\"Battery\":\"99.5Wh\",\"Weight\":\"2.17kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Microsoft Surface Laptop 6", Slug = "microsoft-surface-laptop-6",
            Description = "The Surface Laptop 6 is designed for Copilot+ experiences with a Snapdragon X Elite processor, a stunning 15-inch PixelSense Flow touchscreen, 20+ hour battery life, and Windows 11 with integrated AI features.",
            ShortDescription = "Snapdragon X Elite, 20hr battery, Copilot+ PC, PixelSense Flow",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Brand = "Microsoft", Sku = "MSF-SL6", StockQuantity = 22, IsFeatured = false,
            Specifications = "{\"Display\":\"15\\\" PixelSense Flow Touch 120Hz\",\"Processor\":\"Snapdragon X Elite\",\"Memory\":\"16GB LPDDR5X (base)\",\"Storage\":\"512GB NVMe SSD\",\"Battery\":\"Up to 20+ hours\",\"Weight\":\"1.66kg\",\"NPU\":\"45 TOPS\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Acer Swift Go 14", Slug = "acer-swift-go-14",
            Description = "An ultraportable productivity laptop with Intel Core Ultra 7, a 14-inch 2.8K OLED display, and a lightweight 1.25kg chassis. Great value for students and professionals who need an all-day companion.",
            ShortDescription = "2.8K OLED, Intel Core Ultra 7, 1.25kg, great value",
            BasePrice = 899.00m, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
            Brand = "Acer", Sku = "ACR-SG14", StockQuantity = 28, IsFeatured = false,
            Specifications = "{\"Display\":\"14\\\" 2.8K OLED 90Hz\",\"Processor\":\"Intel Core Ultra 7 155H\",\"Memory\":\"16GB LPDDR5X\",\"Storage\":\"512GB NVMe SSD\",\"GPU\":\"Intel Arc Graphics\",\"Battery\":\"65Wh\",\"Weight\":\"1.25kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "HP Omen 17", Slug = "hp-omen-17",
            Description = "The HP Omen 17 is built for serious gamers. Featuring a 17.3-inch QHD 240Hz display, Intel Core i9-14900HX, and RTX 4080 graphics. Advanced thermals with OMEN Tempest Cooling keep performance consistent during marathon gaming sessions.",
            ShortDescription = "17.3\" QHD 240Hz, RTX 4080, Core i9-14900HX, Tempest Cooling",
            BasePrice = 2399.00m, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Brand = "HP", Sku = "HP-OMEN17", StockQuantity = 11, IsFeatured = false,
            Specifications = "{\"Display\":\"17.3\\\" QHD IPS 240Hz\",\"Processor\":\"Intel Core i9-14900HX\",\"Memory\":\"32GB DDR5\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4080 12GB\",\"Battery\":\"83Wh\",\"Weight\":\"2.78kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Samsung Galaxy Book4 Ultra", Slug = "samsung-galaxy-book4-ultra",
            Description = "Samsung's most powerful laptop features Intel Core Ultra 9, NVIDIA RTX 4070, and a 16-inch Dynamic AMOLED 2X display. Galaxy AI integration syncs seamlessly with your Galaxy phone for cross-device productivity.",
            ShortDescription = "Dynamic AMOLED 2X, RTX 4070, Galaxy AI ecosystem",
            BasePrice = 2399.00m, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GB4U", StockQuantity = 13, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" Dynamic AMOLED 2X 120Hz\",\"Processor\":\"Intel Core Ultra 9 185H\",\"Memory\":\"32GB LPDDR5X\",\"Storage\":\"1TB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4070 8GB\",\"Battery\":\"76Wh\",\"Weight\":\"1.86kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "LG Gram 17", Slug = "lg-gram-17",
            Description = "The LG Gram 17 offers a massive 17-inch WQXGA IPS display in a remarkably light 1.35kg body. Intel Core Ultra 7, 80Wh battery for all-day endurance, and MIL-STD 810H durability. The ultimate screen-to-weight ratio.",
            ShortDescription = "17\" display at 1.35kg, 80Wh battery, Intel Core Ultra 7",
            BasePrice = 1499.00m, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Brand = "LG", Sku = "LG-GRM17", StockQuantity = 17, IsFeatured = false,
            Specifications = "{\"Display\":\"17\\\" WQXGA IPS 60Hz\",\"Processor\":\"Intel Core Ultra 7 155H\",\"Memory\":\"16GB LPDDR5X\",\"Storage\":\"512GB NVMe SSD\",\"Battery\":\"80Wh\",\"Weight\":\"1.35kg\",\"Certifications\":\"MIL-STD 810H\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var lp15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Acer Predator Helios Neo 16", Slug = "acer-predator-helios-neo-16",
            Description = "The Predator Helios Neo 16 delivers serious gaming at a competitive price. Intel Core i7-14700HX, RTX 4060 graphics, a 16-inch WQXGA 165Hz display, and AeroBlade 3D fan technology for efficient cooling during intense gameplay.",
            ShortDescription = "RTX 4060, Core i7-14700HX, 165Hz, AeroBlade 3D cooling",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
            Brand = "Acer", Sku = "ACR-PHLN16", StockQuantity = 19, IsFeatured = false,
            Specifications = "{\"Display\":\"16\\\" WQXGA IPS 165Hz\",\"Processor\":\"Intel Core i7-14700HX\",\"Memory\":\"16GB DDR5\",\"Storage\":\"512GB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4060 8GB\",\"Battery\":\"76Wh\",\"Weight\":\"2.59kg\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ─── Tablets (15) ─────────────────────────────────────────────────────────
        var tb01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "iPad Pro 13\" M4", Slug = "ipad-pro-13-m4",
            Description = "iPad Pro with M4 chip and a stunning Ultra Retina XDR tandem OLED display. The thinnest Apple product ever at just 5.1mm. ProMotion 120Hz, Thunderbolt/USB4, and support for Apple Pencil Pro with barrel roll and squeeze gestures.",
            ShortDescription = "M4 chip, Ultra Retina XDR tandem OLED, 5.1mm thin",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Apple", Sku = "APL-IPP13-M4", StockQuantity = 22, IsFeatured = true,
            Specifications = "{\"Display\":\"13\\\" Ultra Retina XDR Tandem OLED 120Hz\",\"Chip\":\"Apple M4\",\"Storage\":\"256GB (base)\",\"Cameras\":\"12MP Wide + LiDAR\",\"Connectivity\":\"Wi-Fi 6E + optional 5G + Thunderbolt/USB4\",\"Weight\":\"579g\",\"Thickness\":\"5.1mm\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Samsung Galaxy Tab S9 Ultra", Slug = "samsung-galaxy-tab-s9-ultra",
            Description = "Galaxy Tab S9 Ultra is the ultimate creative tablet with a massive 14.6-inch Dynamic AMOLED 2X display and included S Pen. Powered by Snapdragon 8 Gen 2, IP68 water-resistant with dual front cameras for video calls.",
            ShortDescription = "14.6\" Dynamic AMOLED 2X, S Pen included, Snapdragon 8 Gen 2",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GTS9U", StockQuantity = 15, IsFeatured = true,
            Specifications = "{\"Display\":\"14.6\\\" Dynamic AMOLED 2X 120Hz\",\"Chip\":\"Snapdragon 8 Gen 2\",\"Storage\":\"256GB (base)\",\"Cameras\":\"13MP + 8MP Rear | 12MP + 12MP Front\",\"Connectivity\":\"Wi-Fi 6E + optional 5G\",\"Rating\":\"IP68\",\"Weight\":\"732g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "iPad Air 11\" M2", Slug = "ipad-air-11-m2",
            Description = "iPad Air with M2 chip in a versatile 11-inch size. Liquid Retina display, landscape front camera, Wi-Fi 6E, and Apple Pencil Pro support. A capable creative and productivity tablet at a more accessible price point.",
            ShortDescription = "M2 chip, Liquid Retina, landscape camera, Apple Pencil Pro",
            BasePrice = 599.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Apple", Sku = "APL-IPA11-M2", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Display\":\"11\\\" Liquid Retina IPS 60Hz\",\"Chip\":\"Apple M2\",\"Storage\":\"128GB (base)\",\"Cameras\":\"12MP Wide\",\"Connectivity\":\"Wi-Fi 6E + optional 5G\",\"Weight\":\"462g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Samsung Galaxy Tab S9 FE", Slug = "samsung-galaxy-tab-s9-fe",
            Description = "The Galaxy Tab S9 FE brings flagship features to a more accessible price. A 10.9-inch TFT display with S Pen included, Exynos 1380, IP68 rating, and long battery life make it a great all-rounder for students and casual users.",
            ShortDescription = "S Pen included, IP68 rating, 10.9\" display, great value",
            BasePrice = 449.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GTS9FE", StockQuantity = 40, IsFeatured = false,
            Specifications = "{\"Display\":\"10.9\\\" TFT 90Hz\",\"Chip\":\"Exynos 1380\",\"Storage\":\"128GB (base)\",\"Cameras\":\"8MP Rear | 12MP Front\",\"Connectivity\":\"Wi-Fi 6 + optional 5G\",\"Rating\":\"IP68\",\"Weight\":\"523g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Lenovo Tab P12 Pro", Slug = "lenovo-tab-p12-pro",
            Description = "The Lenovo Tab P12 Pro features a 12.7-inch 3K AMOLED display with 120Hz, quad JBL speakers with Dolby Atmos, and MediaTek Dimensity 7050. An optional keyboard and pen transform it into a productivity workstation.",
            ShortDescription = "12.7\" 3K AMOLED, quad JBL speakers, Dolby Atmos",
            BasePrice = 499.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Lenovo", Sku = "LEN-TP12P", StockQuantity = 25, IsFeatured = false,
            Specifications = "{\"Display\":\"12.7\\\" 3K AMOLED 120Hz\",\"Chip\":\"MediaTek Dimensity 7050\",\"Storage\":\"128GB (base)\",\"Cameras\":\"13MP Rear | 8MP Front\",\"Speakers\":\"Quad JBL with Dolby Atmos\",\"Weight\":\"615g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Microsoft Surface Pro 10", Slug = "microsoft-surface-pro-10",
            Description = "The Surface Pro 10 is a Copilot+ PC with Snapdragon X Elite, 13-inch OLED PixelSense Flow display, and an integrated NPU for on-device AI. Use it as a tablet or snap on the Type Cover for a full laptop experience.",
            ShortDescription = "Snapdragon X Elite, 13\" OLED, Copilot+ PC, 2-in-1 versatility",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Microsoft", Sku = "MSF-SP10", StockQuantity = 18, IsFeatured = true,
            Specifications = "{\"Display\":\"13\\\" OLED PixelSense Flow 120Hz\",\"Processor\":\"Snapdragon X Elite\",\"Memory\":\"16GB LPDDR5X (base)\",\"Storage\":\"256GB SSD (base)\",\"Battery\":\"Up to 14 hours\",\"Weight\":\"895g\",\"NPU\":\"45 TOPS\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "OnePlus Pad 2", Slug = "oneplus-pad-2",
            Description = "The OnePlus Pad 2 combines a Snapdragon 8 Gen 3 chipset with a 12.1-inch 3K LCD display and an included magnetic stylus. Six speakers with Dolby Atmos, 67W SUPERVOOC charging, and 9510mAh battery for marathon media consumption.",
            ShortDescription = "Snapdragon 8 Gen 3, 12.1\" 3K, 67W charging, 9510mAh",
            BasePrice = 549.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "OnePlus", Sku = "OPL-PAD2", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Display\":\"12.1\\\" 3K LCD 144Hz\",\"Chip\":\"Snapdragon 8 Gen 3\",\"Storage\":\"256GB\",\"Cameras\":\"13MP Rear | 8MP Front\",\"Battery\":\"9510mAh 67W\",\"Speakers\":\"6 speakers, Dolby Atmos\",\"Weight\":\"584g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "iPad (10th Gen)", Slug = "ipad-10th-gen",
            Description = "The 10th-generation iPad features a complete redesign with a 10.9-inch Liquid Retina display, A14 Bionic chip, USB-C, landscape front camera, and 5G option. All the iPad essentials at an accessible price.",
            ShortDescription = "A14 Bionic, 10.9\" Liquid Retina, USB-C, 5G option",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Apple", Sku = "APL-IPD10", StockQuantity = 50, IsFeatured = false,
            Specifications = "{\"Display\":\"10.9\\\" Liquid Retina IPS 60Hz\",\"Chip\":\"Apple A14 Bionic\",\"Storage\":\"64GB (base)\",\"Cameras\":\"12MP Wide\",\"Connectivity\":\"Wi-Fi 6 + optional 5G + USB-C\",\"Weight\":\"477g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Xiaomi Pad 6S Pro", Slug = "xiaomi-pad-6s-pro",
            Description = "Xiaomi's flagship tablet with a 12.4-inch 3K IPS display at 144Hz, Snapdragon 8 Gen 2, and a 10000mAh battery with 120W HyperCharge. Quad speakers tuned by Harman Kardon deliver immersive entertainment.",
            ShortDescription = "12.4\" 3K 144Hz, Snapdragon 8 Gen 2, 120W HyperCharge",
            BasePrice = 499.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Xiaomi", Sku = "XMI-PAD6SP", StockQuantity = 22, IsFeatured = false,
            Specifications = "{\"Display\":\"12.4\\\" 3K IPS 144Hz\",\"Chip\":\"Snapdragon 8 Gen 2\",\"Storage\":\"256GB (base)\",\"Cameras\":\"50MP Rear | 32MP Front\",\"Battery\":\"10000mAh 120W\",\"Speakers\":\"Quad Harman Kardon\",\"Weight\":\"590g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Amazon Fire Max 11", Slug = "amazon-fire-max-11",
            Description = "Amazon's largest and most powerful tablet features an 11-inch 2K display, an aluminum body, and an octa-core processor. Stylus and keyboard case support, plus deep Alexa integration and access to Amazon's content ecosystem.",
            ShortDescription = "11\" 2K display, aluminum body, Alexa built-in, great value",
            BasePrice = 229.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Amazon", Sku = "AMZ-FMAX11", StockQuantity = 60, IsFeatured = false,
            Specifications = "{\"Display\":\"11\\\" 2K IPS 60Hz\",\"Processor\":\"MediaTek MT8188J\",\"Storage\":\"64GB (base, expandable)\",\"Cameras\":\"8MP Rear | 8MP Front\",\"Battery\":\"Up to 14 hours\",\"Weight\":\"490g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Huawei MatePad Pro 13.2", Slug = "huawei-matepad-pro-13-2",
            Description = "The MatePad Pro 13.2 features a massive 13.2-inch flexible OLED display, Kirin 9000S chipset, and HarmonyOS 4.0 with multi-window multitasking. M-Pencil 3rd Gen and detachable keyboard transform it into a creative workstation.",
            ShortDescription = "13.2\" flexible OLED, Kirin 9000S, M-Pencil 3, HarmonyOS 4",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Huawei", Sku = "HUA-MPP132", StockQuantity = 14, IsFeatured = false,
            Specifications = "{\"Display\":\"13.2\\\" Flexible OLED 120Hz\",\"Chip\":\"Kirin 9000S\",\"Storage\":\"256GB (base)\",\"Cameras\":\"13MP Rear | 16MP Front\",\"Battery\":\"10100mAh 88W\",\"Weight\":\"580g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Google Pixel Tablet", Slug = "google-pixel-tablet",
            Description = "The Google Pixel Tablet combines a personal tablet with a smart home hub. Dock it on the included Charging Speaker Dock to transform it into a Google Nest Hub-style display. Tensor G2 chip, 11-inch LCD, and stock Android experience.",
            ShortDescription = "Includes Speaker Dock, Tensor G2, doubles as smart home hub",
            BasePrice = 499.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Google", Sku = "GOO-PXTAB", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Display\":\"11\\\" LCD 60Hz\",\"Chip\":\"Google Tensor G2\",\"Storage\":\"128GB (base)\",\"Cameras\":\"8MP Rear | 8MP Front\",\"Battery\":\"27Wh\",\"Dock\":\"Charging Speaker Dock included\",\"Weight\":\"493g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "iPad mini (6th Gen)", Slug = "ipad-mini-6th-gen",
            Description = "Small in size, mighty in performance. iPad mini with A15 Bionic chip, 8.3-inch Liquid Retina display, USB-C, 5G connectivity, and Apple Pencil 2 support. The perfect portable powerhouse for on-the-go creativity.",
            ShortDescription = "A15 Bionic, 8.3\" Liquid Retina, USB-C, ultra-portable",
            BasePrice = 499.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Apple", Sku = "APL-IPMN6", StockQuantity = 28, IsFeatured = false,
            Specifications = "{\"Display\":\"8.3\\\" Liquid Retina IPS 60Hz\",\"Chip\":\"Apple A15 Bionic\",\"Storage\":\"64GB (base)\",\"Cameras\":\"12MP Wide\",\"Connectivity\":\"Wi-Fi 6 + optional 5G + USB-C\",\"Weight\":\"293g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Samsung Galaxy Tab A9+", Slug = "samsung-galaxy-tab-a9-plus",
            Description = "An affordable tablet with a big 11-inch TFT display, quad speakers with Dolby Atmos, and Samsung's One UI. Expandable storage, multi-window support, and Samsung Knox security make it ideal for families and students.",
            ShortDescription = "11\" display, quad speakers, Dolby Atmos, family-friendly",
            BasePrice = 269.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GTA9P", StockQuantity = 55, IsFeatured = false,
            Specifications = "{\"Display\":\"11\\\" TFT 90Hz\",\"Chip\":\"Snapdragon 695\",\"Storage\":\"64GB (base, expandable to 1TB)\",\"Cameras\":\"8MP Rear | 5MP Front\",\"Battery\":\"7040mAh 15W\",\"Weight\":\"480g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var tb15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Lenovo Tab P11 Pro Gen 2", Slug = "lenovo-tab-p11-pro-gen-2",
            Description = "A versatile mid-range tablet with an 11.2-inch 2.5K OLED display, MediaTek Kompanio 1300T, quad JBL speakers, and optional Precision Pen 3. A solid entertainment and light productivity device at a competitive price.",
            ShortDescription = "11.2\" 2.5K OLED, quad JBL speakers, Precision Pen 3 support",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Lenovo", Sku = "LEN-TP11PG2", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Display\":\"11.2\\\" 2.5K OLED 120Hz\",\"Chip\":\"MediaTek Kompanio 1300T\",\"Storage\":\"128GB (base)\",\"Cameras\":\"13MP Rear | 8MP Front\",\"Battery\":\"8000mAh 30W\",\"Speakers\":\"Quad JBL with Dolby Atmos\",\"Weight\":\"480g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ─── Audio (15) ───────────────────────────────────────────────────────────
        var au01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Sony WH-1000XM5", Slug = "sony-wh-1000xm5",
            Description = "Industry-leading noise cancellation with the Integrated Processor V1. Eight microphones and two processors work together to block out distractions. 30-hour battery, Multipoint connection, and exceptional sound quality.",
            ShortDescription = "Industry-leading ANC, 30hr battery, Multipoint dual-device",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
            Brand = "Sony", Sku = "SNY-WH1000XM5", StockQuantity = 60, IsFeatured = true,
            Specifications = "{\"Type\":\"Over-ear\",\"Driver\":\"30mm\",\"ANC\":\"Yes — 8 microphones\",\"Battery\":\"30 hours (ANC on)\",\"Charging\":\"USB-C, 3hr full charge\",\"Bluetooth\":\"5.2 with LDAC\",\"Weight\":\"250g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Apple AirPods Pro (2nd Gen)", Slug = "airpods-pro-2nd-gen",
            Description = "AirPods Pro (2nd generation) with H2 chip deliver up to 2x more Active Noise Cancellation. Adaptive Audio controls noise cancellation based on your environment. Personalized Spatial Audio with dynamic head tracking.",
            ShortDescription = "H2 chip, 2x ANC, Adaptive Audio, Personalized Spatial Audio",
            BasePrice = 249.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Apple", Sku = "APL-APP2", StockQuantity = 80, IsFeatured = true,
            Specifications = "{\"Type\":\"In-ear\",\"Chip\":\"Apple H2\",\"ANC\":\"Adaptive ANC\",\"Battery\":\"6hr earbuds + 30hr case\",\"Charging\":\"MagSafe / USB-C\",\"Bluetooth\":\"5.3\",\"Rating\":\"IPX4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Bose QuietComfort Ultra Headphones", Slug = "bose-quietcomfort-ultra",
            Description = "Bose QC Ultra headphones combine world-class noise cancellation with Immersive Audio — a new spatial audio experience that makes music feel like a live performance. CustomTune technology adapts sound to your ear shape.",
            ShortDescription = "World-class ANC, Immersive Audio spatial sound, CustomTune",
            BasePrice = 429.00m, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
            Brand = "Bose", Sku = "BSE-QCULT", StockQuantity = 45, IsFeatured = true,
            Specifications = "{\"Type\":\"Over-ear\",\"ANC\":\"Yes — world-class\",\"Spatial Audio\":\"Bose Immersive Audio\",\"Battery\":\"24 hours\",\"Charging\":\"USB-C\",\"Bluetooth\":\"5.3 with aptX Adaptive\",\"Weight\":\"250g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Sennheiser Momentum 4 Wireless", Slug = "sennheiser-momentum-4",
            Description = "The Sennheiser Momentum 4 delivers audiophile-grade sound with 42mm transducers, Adaptive Noise Cancellation, and an exceptional 60-hour battery life. Premium leather and metal construction for discerning listeners.",
            ShortDescription = "Audiophile sound, 60hr battery, premium leather & metal build",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
            Brand = "Sennheiser", Sku = "SEN-MOM4W", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Type\":\"Over-ear\",\"Driver\":\"42mm\",\"ANC\":\"Adaptive\",\"Battery\":\"60 hours\",\"Charging\":\"USB-C\",\"Bluetooth\":\"5.2 with aptX Adaptive\",\"Weight\":\"293g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Sony WF-1000XM5", Slug = "sony-wf-1000xm5",
            Description = "The smallest and lightest Sony noise-cancelling earbuds ever. Integrated Processor V2 and a new QN2e chip deliver incredible ANC and Hi-Res Audio Wireless (LDAC). Crystal-clear calls with Bone Conduction sensors.",
            ShortDescription = "Smallest Sony ANC earbuds, Hi-Res Audio, Bone Conduction mics",
            BasePrice = 299.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Sony", Sku = "SNY-WF1000XM5", StockQuantity = 55, IsFeatured = false,
            Specifications = "{\"Type\":\"In-ear\",\"Chip\":\"Integrated Processor V2 + QN2e\",\"ANC\":\"Yes — industry-leading\",\"Battery\":\"8hr earbuds + 24hr case\",\"Charging\":\"USB-C / Qi wireless\",\"Bluetooth\":\"5.3 with LDAC\",\"Rating\":\"IPX4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Samsung Galaxy Buds3 Pro", Slug = "samsung-galaxy-buds3-pro",
            Description = "Galaxy Buds3 Pro feature a blade-like design with adaptive dual drivers for rich Hi-Fi sound. Galaxy AI-powered Adaptive Noise Control, 360 Audio with head tracking, and seamless switching across Galaxy devices.",
            ShortDescription = "Blade design, adaptive dual drivers, Galaxy AI noise control",
            BasePrice = 249.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GB3P", StockQuantity = 50, IsFeatured = false,
            Specifications = "{\"Type\":\"In-ear\",\"Driver\":\"Dual (10.5mm + 6.1mm planar)\",\"ANC\":\"Adaptive AI\",\"Battery\":\"6hr earbuds + 26hr case\",\"Charging\":\"USB-C / Qi wireless\",\"Bluetooth\":\"5.4 with SSC HiFi\",\"Rating\":\"IP57\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Sonos Era 300", Slug = "sonos-era-300",
            Description = "Sonos Era 300 is an immersive spatial audio speaker with six drivers arranged in three axes to fill your room with sound from every direction. Supports Dolby Atmos, Amazon Spatial Audio, and Sony 360 Reality Audio.",
            ShortDescription = "6-driver spatial audio, Dolby Atmos, room-filling immersion",
            BasePrice = 449.00m, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
            Brand = "Sonos", Sku = "SON-ERA300", StockQuantity = 25, IsFeatured = false,
            Specifications = "{\"Type\":\"Smart speaker\",\"Drivers\":\"6 (tweeters + mid-woofers)\",\"Spatial Audio\":\"Dolby Atmos, Sony 360 RA\",\"Voice\":\"Sonos Voice + Alexa\",\"Connectivity\":\"Wi-Fi 6, Bluetooth 5.0, AirPlay 2\",\"Weight\":\"4.73kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "JBL Charge 5", Slug = "jbl-charge-5",
            Description = "The JBL Charge 5 delivers powerful JBL Pro Sound with a racetrack-shaped driver and dual bass radiators. IP67 waterproof and dustproof, 20-hour battery, and a built-in powerbank to charge your devices on the go.",
            ShortDescription = "JBL Pro Sound, IP67 waterproof, 20hr battery, built-in powerbank",
            BasePrice = 179.00m, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
            Brand = "JBL", Sku = "JBL-CHG5", StockQuantity = 70, IsFeatured = false,
            Specifications = "{\"Type\":\"Portable Bluetooth speaker\",\"Driver\":\"Racetrack woofer + tweeter\",\"Waterproof\":\"IP67\",\"Battery\":\"20 hours\",\"Charging\":\"USB-C\",\"Bluetooth\":\"5.1\",\"Weight\":\"960g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Apple AirPods Max", Slug = "apple-airpods-max",
            Description = "Apple's premium over-ear headphones with H1 chip in each ear cup. Computational audio with Adaptive EQ, Active Noise Cancellation, Spatial Audio with dynamic head tracking, and a Digital Crown for precise volume control.",
            ShortDescription = "H1 chip, computational audio, Digital Crown, premium build",
            BasePrice = 549.00m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
            Brand = "Apple", Sku = "APL-APM", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Type\":\"Over-ear\",\"Chip\":\"Apple H1 (each ear cup)\",\"ANC\":\"Active Noise Cancellation\",\"Spatial Audio\":\"Dynamic head tracking\",\"Battery\":\"20 hours\",\"Charging\":\"Lightning / USB-C\",\"Weight\":\"384g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Beyerdynamic DT 900 Pro X", Slug = "beyerdynamic-dt-900-pro-x",
            Description = "Professional open-back studio headphones with Beyerdynamic's STELLAR.45 driver for precise, revealing audio. Lightweight, comfortable for extended mixing sessions, and a detachable mini-XLR cable system.",
            ShortDescription = "STELLAR.45 driver, open-back studio reference, mini-XLR cable",
            BasePrice = 269.00m, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
            Brand = "Beyerdynamic", Sku = "BYR-DT900PX", StockQuantity = 25, IsFeatured = false,
            Specifications = "{\"Type\":\"Over-ear open-back\",\"Driver\":\"STELLAR.45 (45mm)\",\"Impedance\":\"48 ohms\",\"Frequency\":\"5 – 40,000 Hz\",\"Cable\":\"Detachable mini-XLR\",\"Weight\":\"345g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Marshall Emberton II", Slug = "marshall-emberton-ii",
            Description = "The Marshall Emberton II brings iconic Marshall sound in a compact portable speaker. True Stereophonic multi-directional sound, IP67 water and dust resistance, 30+ hours battery life, and the classic Marshall amp-inspired design.",
            ShortDescription = "True Stereophonic sound, IP67, 30hr battery, iconic design",
            BasePrice = 149.00m, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
            Brand = "Marshall", Sku = "MRS-EMB2", StockQuantity = 55, IsFeatured = false,
            Specifications = "{\"Type\":\"Portable Bluetooth speaker\",\"Sound\":\"True Stereophonic multi-directional\",\"Waterproof\":\"IP67\",\"Battery\":\"30+ hours\",\"Bluetooth\":\"5.3\",\"Weight\":\"700g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Nothing Ear (2)", Slug = "nothing-ear-2",
            Description = "Nothing Ear (2) feature a transparent stem design with custom 11.6mm dynamic drivers and dual-chamber construction. Hi-Res Audio certified, personalized ANC with up to 40dB reduction, and seamless integration with Nothing OS.",
            ShortDescription = "Transparent design, 11.6mm driver, Hi-Res Audio, personalized ANC",
            BasePrice = 149.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Nothing", Sku = "NTH-EAR2", StockQuantity = 40, IsFeatured = false,
            Specifications = "{\"Type\":\"In-ear\",\"Driver\":\"11.6mm custom dynamic\",\"ANC\":\"Personalized, up to 40dB\",\"Battery\":\"4.5hr earbuds + 36hr case\",\"Charging\":\"USB-C / Qi wireless\",\"Bluetooth\":\"5.3 with LHDC 5.0\",\"Rating\":\"IP54\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Bose SoundLink Max", Slug = "bose-soundlink-max",
            Description = "The Bose SoundLink Max delivers room-filling sound from a surprisingly portable form factor. Dual opposing passive radiators for deep bass, IP67 protection, and up to 20 hours of battery. Pair two for true stereo.",
            ShortDescription = "Room-filling bass, IP67, 20hr battery, stereo pairing",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
            Brand = "Bose", Sku = "BSE-SLMAX", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Type\":\"Portable Bluetooth speaker\",\"Drivers\":\"2 racetrack woofers + 2 passive radiators\",\"Waterproof\":\"IP67\",\"Battery\":\"20 hours\",\"Bluetooth\":\"5.3\",\"Connectivity\":\"Bluetooth + AUX\",\"Weight\":\"2.3kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Audio-Technica ATH-M50xBT2", Slug = "audio-technica-ath-m50xbt2",
            Description = "The wireless version of the legendary ATH-M50x studio monitors. 45mm large-aperture drivers with rare earth magnets deliver the same acclaimed sound signature with Bluetooth 5.0, LDAC support, and 50-hour battery life.",
            ShortDescription = "Legendary M50x sound, 50hr battery, LDAC, studio-grade wireless",
            BasePrice = 199.00m, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
            Brand = "Audio-Technica", Sku = "ATH-M50XBT2", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Type\":\"Over-ear\",\"Driver\":\"45mm large-aperture\",\"Battery\":\"50 hours\",\"Bluetooth\":\"5.0 with LDAC\",\"Frequency\":\"15 – 28,000 Hz\",\"Charging\":\"USB-C\",\"Weight\":\"307g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var au15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Jabra Elite 10", Slug = "jabra-elite-10",
            Description = "Jabra Elite 10 earbuds combine Dolby Atmos spatial sound with Jabra Advanced ANC and a semi-open comfort design with no ear pressure. Jabra ComfortFit technology uses an ear scan to optimize seal and ANC performance.",
            ShortDescription = "Dolby Atmos, semi-open comfort, Jabra ComfortFit ear scan",
            BasePrice = 249.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Jabra", Sku = "JBR-ELT10", StockQuantity = 40, IsFeatured = false,
            Specifications = "{\"Type\":\"In-ear\",\"ANC\":\"Jabra Advanced ANC\",\"Spatial Audio\":\"Dolby Atmos with head tracking\",\"Battery\":\"6hr earbuds + 27hr case\",\"Charging\":\"USB-C / Qi wireless\",\"Bluetooth\":\"5.3\",\"Rating\":\"IP57\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ─── Wearables (15) ───────────────────────────────────────────────────────
        var wr01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Apple Watch Series 9", Slug = "apple-watch-series-9",
            Description = "Apple Watch Series 9 introduces the S9 chip and a new Double Tap gesture. 2000 nit Always-On Retina display. Advanced health features include ECG, blood oxygen, crash detection, and temperature sensing.",
            ShortDescription = "S9 chip, Double Tap gesture, 2000 nits display, ECG",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Apple", Sku = "APL-AWS9", StockQuantity = 55, IsFeatured = true,
            Specifications = "{\"Case Sizes\":\"41mm or 45mm\",\"Chip\":\"Apple S9 SiP\",\"Display\":\"Always-On Retina LTPO OLED\",\"Health\":\"ECG, Blood Oxygen, Temperature, Crash Detection\",\"Battery\":\"Up to 18 hours\",\"Water Resistance\":\"50m\",\"Connectivity\":\"GPS + optional Cellular\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Samsung Galaxy Watch 6 Classic", Slug = "samsung-galaxy-watch-6-classic",
            Description = "The Galaxy Watch 6 Classic brings back the iconic rotating bezel. BioActive Sensor for comprehensive health tracking, advanced sleep coaching, and Wear OS 4 with Galaxy AI features.",
            ShortDescription = "Rotating bezel, BioActive Sensor, sleep coaching, Wear OS 4",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GWC6", StockQuantity = 38, IsFeatured = false,
            Specifications = "{\"Case Sizes\":\"43mm or 47mm\",\"Display\":\"Super AMOLED\",\"Processor\":\"Exynos W930\",\"Sensors\":\"BioActive (HR, SpO2, ECG, Bioelectrical Impedance)\",\"Battery\":\"300mAh (43mm) / 425mAh (47mm)\",\"Water Resistance\":\"5ATM + IP68\",\"OS\":\"Wear OS 4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Garmin Fenix 7 Pro", Slug = "garmin-fenix-7-pro",
            Description = "The ultimate adventure smartwatch. Built-in LED flashlight, solar charging capability, multi-band GPS for pinpoint accuracy. Topographic, ski, and golf maps preloaded. Up to 22 days battery life.",
            ShortDescription = "LED flashlight, solar charging, multi-band GPS, 22-day battery",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "Garmin", Sku = "GRM-FNX7P", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Case Size\":\"47mm / 51mm (X)\",\"Display\":\"1.3\\\" MIP with LED Backlight\",\"GPS\":\"Multi-band GPS/GNSS\",\"Battery\":\"Up to 22 days / 36 days solar\",\"Water Rating\":\"10 ATM\",\"Maps\":\"Topographic, Ski, Golf\",\"Sensors\":\"HR, SpO2, Stress, Body Battery\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Apple Watch Ultra 2", Slug = "apple-watch-ultra-2",
            Description = "Apple Watch Ultra 2 is built for extreme athletes and outdoor adventurers. Titanium case, 3000 nit display, precision dual-frequency GPS, depth gauge, siren, and up to 36 hours of battery life (72 hours in Low Power Mode).",
            ShortDescription = "Titanium, 3000 nits, dual-frequency GPS, depth gauge, 36hr battery",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Apple", Sku = "APL-AWU2", StockQuantity = 25, IsFeatured = true,
            Specifications = "{\"Case Size\":\"49mm\",\"Material\":\"Titanium\",\"Chip\":\"Apple S9 SiP\",\"Display\":\"Always-On Retina 3000 nits\",\"GPS\":\"Precision Dual-Frequency L1/L5\",\"Battery\":\"Up to 36 hours (72h low power)\",\"Water Resistance\":\"100m, EN 13319\",\"Depth Gauge\":\"Yes\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Google Pixel Watch 2", Slug = "google-pixel-watch-2",
            Description = "Google Pixel Watch 2 with Qualcomm 5100 processor, improved heart rate sensor, and cEDA stress sensor. Tight Fitbit integration for health metrics, Google Maps navigation, and Wear OS 4 with Google AI.",
            ShortDescription = "Qualcomm 5100, Fitbit health suite, cEDA stress sensor, Wear OS 4",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            Brand = "Google", Sku = "GOO-PW2", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Case Size\":\"41mm\",\"Display\":\"AMOLED 320 ppi\",\"Processor\":\"Qualcomm 5100\",\"Sensors\":\"HR, SpO2, cEDA, Temperature\",\"Battery\":\"Up to 24 hours\",\"Water Resistance\":\"5ATM\",\"OS\":\"Wear OS 4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Fitbit Charge 6", Slug = "fitbit-charge-6",
            Description = "Fitbit's most advanced fitness tracker with built-in GPS, Google Maps, Google Wallet, and YouTube Music controls. Continuous heart rate monitoring, Daily Readiness Score, and up to 7 days battery life.",
            ShortDescription = "Built-in GPS, Google integration, 7-day battery, Daily Readiness",
            BasePrice = 159.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "Fitbit", Sku = "FBT-CHG6", StockQuantity = 45, IsFeatured = false,
            Specifications = "{\"Display\":\"AMOLED touchscreen\",\"GPS\":\"Built-in\",\"Sensors\":\"HR, SpO2, EDA, Skin Temperature\",\"Battery\":\"Up to 7 days\",\"Water Resistance\":\"50m\",\"Google\":\"Maps, Wallet, YouTube Music\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Garmin Venu 3", Slug = "garmin-venu-3",
            Description = "Garmin Venu 3 features a brilliant AMOLED display, Body Battery energy monitor, sleep coach with nap detection, and a built-in speaker and microphone for Bluetooth calls. Up to 14 days battery life in smartwatch mode.",
            ShortDescription = "AMOLED display, nap detection, Bluetooth calls, 14-day battery",
            BasePrice = 449.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Garmin", Sku = "GRM-VEN3", StockQuantity = 28, IsFeatured = false,
            Specifications = "{\"Case Sizes\":\"41mm (3S) / 45mm\",\"Display\":\"AMOLED\",\"GPS\":\"Multi-GNSS\",\"Battery\":\"Up to 14 days\",\"Sensors\":\"HR, SpO2, Body Battery, Stress, Nap Detection\",\"Speaker/Mic\":\"Yes — Bluetooth calls\",\"Water Resistance\":\"5ATM\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Whoop 4.0", Slug = "whoop-4-0",
            Description = "Whoop 4.0 is a screenless fitness tracker focused on recovery, strain, and sleep analysis. Worn 24/7, it provides personalized daily strain targets and recovery scores based on HRV, resting heart rate, sleep quality, and more.",
            ShortDescription = "Screenless design, recovery/strain tracking, HRV-based coaching",
            BasePrice = 239.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "Whoop", Sku = "WHP-40", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Display\":\"None (app-based)\",\"Sensors\":\"PPG HR, SpO2, Skin Temp, Accelerometer\",\"Battery\":\"Up to 5 days\",\"Water Resistance\":\"IP68\",\"Subscription\":\"Required (monthly/annual)\",\"Weight\":\"27g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Samsung Galaxy Ring", Slug = "samsung-galaxy-ring",
            Description = "Samsung Galaxy Ring is a smart ring that tracks sleep, activity, and heart rate directly from your finger. Titanium Grade 5 construction, up to 7-day battery, and deep integration with Samsung Health for holistic wellness insights.",
            ShortDescription = "Smart ring, titanium Grade 5, 7-day battery, Samsung Health",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GRNG", StockQuantity = 22, IsFeatured = false,
            Specifications = "{\"Material\":\"Titanium Grade 5\",\"Sensors\":\"PPG HR, Skin Temperature, Accelerometer\",\"Battery\":\"Up to 7 days\",\"Water Resistance\":\"10ATM\",\"Weight\":\"2.3-3.0g\",\"Sizes\":\"5-13\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Oura Ring Gen 3", Slug = "oura-ring-gen-3",
            Description = "Oura Ring Generation 3 tracks sleep stages, HRV, body temperature trends, and daytime heart rate in a sleek titanium ring. Lightweight, durable, and designed to be worn 24/7 with up to 7 days battery life.",
            ShortDescription = "Titanium smart ring, sleep/HRV tracking, 7-day battery",
            BasePrice = 299.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Oura", Sku = "OUR-RNG3", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Material\":\"Titanium\",\"Sensors\":\"PPG HR, SpO2, Skin Temperature, 3D Accelerometer\",\"Battery\":\"Up to 7 days\",\"Water Resistance\":\"100m\",\"Weight\":\"4-6g\",\"Subscription\":\"Optional (monthly)\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Amazfit T-Rex Ultra", Slug = "amazfit-t-rex-ultra",
            Description = "Built for extreme environments. The Amazfit T-Rex Ultra meets military-grade MIL-STD-810G standards, offers freediving support to 30 meters, multi-band GPS, and an incredible 20-day battery life. Trail-run navigation with offline maps.",
            ShortDescription = "MIL-STD-810G, freediving 30m, multi-band GPS, 20-day battery",
            BasePrice = 299.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "Amazfit", Sku = "AMZ-TRXU", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Case Size\":\"47.1mm\",\"Display\":\"1.39\\\" AMOLED\",\"GPS\":\"Dual-band\",\"Battery\":\"Up to 20 days\",\"Water Resistance\":\"10 ATM (30m freediving)\",\"Standard\":\"MIL-STD-810G\",\"Weight\":\"89g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Garmin Forerunner 265", Slug = "garmin-forerunner-265",
            Description = "The Forerunner 265 features a vibrant AMOLED display with race-day performance metrics. Morning Report with HRV status, Training Readiness score, daily suggested workouts, and up to 13 days of battery life in smartwatch mode.",
            ShortDescription = "AMOLED display, Training Readiness, HRV status, 13-day battery",
            BasePrice = 449.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Garmin", Sku = "GRM-FR265", StockQuantity = 25, IsFeatured = false,
            Specifications = "{\"Case Sizes\":\"42mm (265S) / 46mm\",\"Display\":\"AMOLED\",\"GPS\":\"Multi-band GNSS\",\"Battery\":\"Up to 13 days\",\"Sensors\":\"HR, SpO2, Running Dynamics, HRV\",\"Music\":\"On-device storage\",\"Water Resistance\":\"5ATM\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Xiaomi Smart Band 8 Pro", Slug = "xiaomi-smart-band-8-pro",
            Description = "Feature-packed for its price. The Xiaomi Smart Band 8 Pro has a 1.74-inch AMOLED display, built-in GPS, 150+ workout modes, SpO2 monitoring, and up to 14 days battery. A budget fitness tracker that punches above its weight.",
            ShortDescription = "1.74\" AMOLED, built-in GPS, 14-day battery, budget price",
            BasePrice = 69.00m, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            Brand = "Xiaomi", Sku = "XMI-SB8P", StockQuantity = 80, IsFeatured = false,
            Specifications = "{\"Display\":\"1.74\\\" AMOLED 60Hz\",\"GPS\":\"Built-in\",\"Sensors\":\"HR, SpO2\",\"Battery\":\"Up to 14 days\",\"Water Resistance\":\"5ATM\",\"Workouts\":\"150+ modes\",\"Weight\":\"24.3g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Withings ScanWatch 2", Slug = "withings-scanwatch-2",
            Description = "Withings ScanWatch 2 is a medically certified hybrid smartwatch that looks like a classic analog timepiece. ECG, SpO2, continuous temperature monitoring, and respiratory rate tracking. Up to 30 days battery life.",
            ShortDescription = "Medically certified ECG, analog design, 30-day battery",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Withings", Sku = "WTH-SW2", StockQuantity = 18, IsFeatured = false,
            Specifications = "{\"Case Sizes\":\"38mm / 42mm\",\"Display\":\"Hybrid (analog + OLED)\",\"Health\":\"ECG, SpO2, Temperature, Respiratory Rate\",\"Battery\":\"Up to 30 days\",\"Water Resistance\":\"5ATM\",\"Weight\":\"35g (38mm)\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var wr15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "COROS PACE 3", Slug = "coros-pace-3",
            Description = "COROS PACE 3 is a lightweight GPS running watch at just 39g. Dual-frequency GPS, optical heart rate, 24-day battery life, and a nylon band option for all-day comfort. Free training plans and COROS Training Hub integration.",
            ShortDescription = "39g ultralight, dual-frequency GPS, 24-day battery",
            BasePrice = 229.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "COROS", Sku = "CRS-PACE3", StockQuantity = 22, IsFeatured = false,
            Specifications = "{\"Case Size\":\"41mm\",\"Display\":\"1.2\\\" MIP always-on\",\"GPS\":\"Dual-frequency\",\"Battery\":\"Up to 24 days\",\"Sensors\":\"Optical HR, SpO2, Barometric Altimeter\",\"Water Resistance\":\"5ATM\",\"Weight\":\"39g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ─── Accessories (15) ─────────────────────────────────────────────────────
        var ac01 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Anker 737 MagGo Charger", Slug = "anker-737-maggo-charger",
            Description = "15W MagSafe-compatible wireless charging for iPhone 12 and later. Foldable design for portability, USB-C power input, and a built-in stand for FaceTime and content viewing.",
            ShortDescription = "15W MagSafe-compatible, foldable stand, USB-C input",
            BasePrice = 59.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Anker", Sku = "ANK-737MGO", StockQuantity = 120, IsFeatured = false,
            Specifications = "{\"Charging\":\"15W MagSafe-compatible Qi2\",\"Input\":\"USB-C 20W\",\"Compatibility\":\"iPhone 12+\",\"Design\":\"Foldable stand\",\"Cable\":\"5ft USB-C included\",\"Weight\":\"57g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac02 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Logitech MX Master 3S", Slug = "logitech-mx-master-3s",
            Description = "The most advanced Master Series mouse with Quiet Clicks reducing noise by 90%. MagSpeed electromagnetic scrolling, 8K DPI Darkfield sensor, and ergonomic design for all-day productivity.",
            ShortDescription = "90% quieter clicks, MagSpeed scrolling, 8K DPI, ergonomic",
            BasePrice = 99.00m, ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
            Brand = "Logitech", Sku = "LGT-MXM3S", StockQuantity = 90, IsFeatured = false,
            Specifications = "{\"Sensor\":\"Darkfield 8000 DPI\",\"Buttons\":\"7 programmable\",\"Scrolling\":\"MagSpeed electromagnetic\",\"Battery\":\"Up to 70 days\",\"Connectivity\":\"Bluetooth + USB Receiver\",\"Weight\":\"141g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac03 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Samsung T7 Portable SSD", Slug = "samsung-t7-portable-ssd",
            Description = "NVMe speeds up to 1,050 MB/s in a compact, pocket-sized metal design. AES 256-bit hardware encryption and password protection. USB 3.2 Gen 2 for maximum transfer speeds.",
            ShortDescription = "Up to 1,050 MB/s, AES 256-bit encryption, compact metal design",
            BasePrice = 89.00m, ImageUrl = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-T7SSD", StockQuantity = 75, IsFeatured = false,
            Specifications = "{\"Interface\":\"USB 3.2 Gen 2 (10Gbps)\",\"Read Speed\":\"Up to 1,050 MB/s\",\"Write Speed\":\"Up to 1,000 MB/s\",\"Security\":\"AES 256-bit\",\"Connector\":\"USB-C (USB-A adapter)\",\"Weight\":\"58g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac04 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Apple Magic Keyboard with Touch ID", Slug = "apple-magic-keyboard-touch-id",
            Description = "Apple Magic Keyboard with Touch ID and Numeric Keypad delivers a comfortable typing experience with a remarkably stable scissor mechanism. Touch ID sensor for secure login and Apple Pay. USB-C charging.",
            ShortDescription = "Touch ID, numeric keypad, scissor mechanism, USB-C",
            BasePrice = 199.00m, ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
            Brand = "Apple", Sku = "APL-MKBTID", StockQuantity = 50, IsFeatured = false,
            Specifications = "{\"Layout\":\"Full-size with numeric keypad\",\"Security\":\"Touch ID\",\"Connection\":\"Bluetooth + Lightning/USB-C\",\"Battery\":\"1 month per charge\",\"Compatibility\":\"Mac with Apple Silicon\",\"Weight\":\"390g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac05 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Anker Prime 20000mAh Power Bank", Slug = "anker-prime-20000-power-bank",
            Description = "Anker Prime 20000mAh delivers 200W total output for charging laptops, tablets, and phones simultaneously. Smart Digital Display shows real-time power metrics. USB-C PD 3.1 for 100W single-port output.",
            ShortDescription = "200W total output, 20000mAh, laptop charging, digital display",
            BasePrice = 129.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Anker", Sku = "ANK-PRM20K", StockQuantity = 65, IsFeatured = false,
            Specifications = "{\"Capacity\":\"20000mAh / 71.4Wh\",\"Output\":\"200W total (100W single USB-C)\",\"Input\":\"USB-C 100W\",\"Ports\":\"2x USB-C + 1x USB-A\",\"Display\":\"Smart Digital Display\",\"Weight\":\"500g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac06 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Keychron Q1 Pro Mechanical Keyboard", Slug = "keychron-q1-pro",
            Description = "Premium wireless mechanical keyboard with full aluminum CNC body, gasket mount design, hot-swappable switches, QMK/VIA support, and 1000Hz polling rate. Bluetooth 5.1 and 2.4GHz wireless with up to 300-hour battery.",
            ShortDescription = "CNC aluminum, gasket mount, hot-swap, QMK/VIA, wireless",
            BasePrice = 199.00m, ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
            Brand = "Keychron", Sku = "KEY-Q1PRO", StockQuantity = 35, IsFeatured = false,
            Specifications = "{\"Layout\":\"75% (84 keys)\",\"Switch\":\"Gateron Jupiter (hot-swappable)\",\"Body\":\"CNC aluminum\",\"Mount\":\"Gasket\",\"Connectivity\":\"Bluetooth 5.1 + 2.4GHz + USB-C\",\"Battery\":\"Up to 300 hours\",\"Weight\":\"1.7kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac07 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "CalDigit TS4 Thunderbolt 4 Dock", Slug = "caldigit-ts4-thunderbolt-4-dock",
            Description = "The CalDigit TS4 is the most versatile Thunderbolt 4 dock with 18 ports including 2.5GbE, SD/microSD UHS-II, three Thunderbolt downstream, and 98W laptop charging. A single cable to rule your entire desk setup.",
            ShortDescription = "18 ports, 98W charging, 2.5GbE, triple Thunderbolt downstream",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "CalDigit", Sku = "CLD-TS4", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Ports\":\"18 total\",\"Thunderbolt\":\"3x TB4 downstream\",\"Ethernet\":\"2.5GbE\",\"Card Reader\":\"SD + microSD UHS-II\",\"Charging\":\"98W to host laptop\",\"USB-A\":\"5x USB-A 10Gbps\",\"Weight\":\"650g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac08 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Logitech MX Keys S", Slug = "logitech-mx-keys-s",
            Description = "MX Keys S features Perfect Stroke keys for fluid and accurate typing, Smart Actions for one-tap automation, and proximity-activated backlighting. Pairs with up to 3 devices and switches seamlessly with Easy-Switch.",
            ShortDescription = "Perfect Stroke keys, Smart Actions, backlit, multi-device",
            BasePrice = 109.00m, ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
            Brand = "Logitech", Sku = "LGT-MXKS", StockQuantity = 55, IsFeatured = false,
            Specifications = "{\"Layout\":\"Full-size\",\"Keys\":\"Perfect Stroke low-profile\",\"Backlight\":\"Proximity-activated\",\"Battery\":\"Up to 10 days (backlit) / 5 months (off)\",\"Connectivity\":\"Bluetooth + Logi Bolt USB\",\"Weight\":\"506g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac09 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Apple Pencil Pro", Slug = "apple-pencil-pro",
            Description = "Apple Pencil Pro features a squeeze gesture for quick tool switching, barrel roll for precise brush control, and haptic feedback. Find My support so you never lose it. Magnetically attaches and charges on compatible iPads.",
            ShortDescription = "Squeeze gesture, barrel roll, haptic feedback, Find My",
            BasePrice = 129.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Apple", Sku = "APL-PNPRO", StockQuantity = 70, IsFeatured = false,
            Specifications = "{\"Compatibility\":\"iPad Pro M4, iPad Air M2\",\"Features\":\"Squeeze, Barrel Roll, Haptic\",\"Charging\":\"Magnetic wireless\",\"Tracking\":\"Find My\",\"Latency\":\"Ultra-low\",\"Weight\":\"20.7g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac10 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Dbrand Grip Case (iPhone 15 Pro)", Slug = "dbrand-grip-case-iphone-15-pro",
            Description = "Dbrand Grip Case offers military-grade drop protection with a micro-dot matrix grip texture. Precision-machined button covers, raised bezels for camera and screen, and full compatibility with MagSafe accessories.",
            ShortDescription = "Military-grade protection, micro-dot grip, MagSafe compatible",
            BasePrice = 49.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Dbrand", Sku = "DBR-GRIP-IP15P", StockQuantity = 100, IsFeatured = false,
            Specifications = "{\"Compatibility\":\"iPhone 15 Pro\",\"Protection\":\"Military-grade MIL-STD-810G\",\"Grip\":\"Micro-dot matrix\",\"MagSafe\":\"Compatible\",\"Bezels\":\"Raised for camera + screen\",\"Weight\":\"35g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac11 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "SanDisk Extreme Pro microSDXC 1TB", Slug = "sandisk-extreme-pro-microsd-1tb",
            Description = "SanDisk Extreme Pro 1TB microSDXC with read speeds up to 200 MB/s and write speeds up to 140 MB/s. A2 App Performance rating for fast app loading. Built to withstand extreme conditions.",
            ShortDescription = "1TB, 200 MB/s read, A2 App Performance, extreme durability",
            BasePrice = 129.00m, ImageUrl = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
            Brand = "SanDisk", Sku = "SDK-EXTP-1TB", StockQuantity = 80, IsFeatured = false,
            Specifications = "{\"Capacity\":\"1TB\",\"Read Speed\":\"Up to 200 MB/s\",\"Write Speed\":\"Up to 140 MB/s\",\"Rating\":\"U3, V30, A2\",\"Durability\":\"Temperature, water, shock, X-ray proof\",\"Adapter\":\"SD adapter included\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac12 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Belkin BoostCharge Pro 3-in-1", Slug = "belkin-boostcharge-pro-3in1",
            Description = "Belkin BoostCharge Pro charges your iPhone (15W MagSafe), Apple Watch (fast charge), and AirPods simultaneously. StandBy mode compatible, premium chrome and wood-grain design for a clean desk aesthetic.",
            ShortDescription = "MagSafe 3-in-1, fast Apple Watch charge, StandBy mode",
            BasePrice = 149.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Belkin", Sku = "BLK-BCP3IN1", StockQuantity = 40, IsFeatured = false,
            Specifications = "{\"iPhone\":\"15W MagSafe\",\"Apple Watch\":\"Fast charge\",\"AirPods\":\"5W Qi\",\"Compatibility\":\"iPhone 12+, Apple Watch, AirPods\",\"Design\":\"Chrome + wood-grain base\",\"Cable\":\"1.5m attached\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac13 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Nomad Tracking Card", Slug = "nomad-tracking-card",
            Description = "Nomad Tracking Card is a credit-card-thin Find My tracker for your wallet. Just 2mm thin, it integrates with Apple's Find My network. Rechargeable via built-in MagSafe-compatible wireless charging, with up to 5 months battery.",
            ShortDescription = "Credit-card-thin, Find My network, 5-month battery, rechargeable",
            BasePrice = 39.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Nomad", Sku = "NMD-TRKCARD", StockQuantity = 90, IsFeatured = false,
            Specifications = "{\"Thickness\":\"2mm\",\"Tracking\":\"Apple Find My\",\"Battery\":\"Up to 5 months\",\"Charging\":\"Magnetic wireless\",\"Compatibility\":\"Any wallet\",\"Weight\":\"12g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac14 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Ugreen Nexode 100W USB-C Charger", Slug = "ugreen-nexode-100w-charger",
            Description = "Ugreen Nexode 100W GaN charger delivers laptop-class power in a compact size. 3 USB-C ports and 1 USB-A with intelligent power distribution. GaN II technology runs cooler and smaller than traditional chargers.",
            ShortDescription = "100W GaN, 4 ports, laptop charging, compact design",
            BasePrice = 69.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Ugreen", Sku = "UGR-NXD100W", StockQuantity = 85, IsFeatured = false,
            Specifications = "{\"Output\":\"100W total (single port max 100W)\",\"Ports\":\"3x USB-C + 1x USB-A\",\"Technology\":\"GaN II\",\"Compatibility\":\"Laptops, tablets, phones\",\"Foldable Plug\":\"Yes\",\"Weight\":\"220g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var ac15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Peak Design Everyday Backpack V2", Slug = "peak-design-everyday-backpack-v2",
            Description = "Peak Design Everyday Backpack V2 features MagLatch quick access, FlexFold dividers for customizable organization, weatherproof 100% recycled nylon shell, and a dedicated laptop compartment. Designed for photographers and commuters.",
            ShortDescription = "MagLatch access, FlexFold dividers, recycled nylon, weatherproof",
            BasePrice = 289.00m, ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
            Brand = "Peak Design", Sku = "PKD-EDBP-V2", StockQuantity = 30, IsFeatured = false,
            Specifications = "{\"Volume\":\"20L or 30L\",\"Material\":\"100% recycled 400D nylon\",\"Laptop\":\"Up to 16\\\" compartment\",\"Access\":\"MagLatch top + dual side zips\",\"Weather\":\"DWR weatherproof coating\",\"Weight\":\"1.39kg (20L)\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // ── Save all products ─────────────────────────────────────────────────────
        var allProducts = new[]
        {
            sp01, sp02, sp03, sp04, sp05, sp06, sp07, sp08, sp09, sp10, sp11, sp12, sp13, sp14, sp15,
            lp01, lp02, lp03, lp04, lp05, lp06, lp07, lp08, lp09, lp10, lp11, lp12, lp13, lp14, lp15,
            tb01, tb02, tb03, tb04, tb05, tb06, tb07, tb08, tb09, tb10, tb11, tb12, tb13, tb14, tb15,
            au01, au02, au03, au04, au05, au06, au07, au08, au09, au10, au11, au12, au13, au14, au15,
            wr01, wr02, wr03, wr04, wr05, wr06, wr07, wr08, wr09, wr10, wr11, wr12, wr13, wr14, wr15,
            ac01, ac02, ac03, ac04, ac05, ac06, ac07, ac08, ac09, ac10, ac11, ac12, ac13, ac14, ac15
        };
        await context.Products.AddRangeAsync(allProducts);
        await context.SaveChangesAsync();

        // ── Variants (2 per product = 180) ────────────────────────────────────────
        var variants = new List<ProductVariant>();

        void AddVariants(Product p, string v1Name, string v1Sku, decimal v1Mod, int v1Stock, string v2Name, string v2Sku, decimal v2Mod, int v2Stock)
        {
            variants.Add(new ProductVariant { Id = Guid.NewGuid(), ProductId = p.Id, Name = v1Name, Sku = v1Sku, PriceModifier = v1Mod, StockQuantity = v1Stock });
            variants.Add(new ProductVariant { Id = Guid.NewGuid(), ProductId = p.Id, Name = v2Name, Sku = v2Sku, PriceModifier = v2Mod, StockQuantity = v2Stock });
        }

        // Smartphones
        AddVariants(sp01, "256GB Natural Titanium", "APL-IP15PM-256-NT", 0, 18, "512GB Blue Titanium", "APL-IP15PM-512-BT", 100, 12);
        AddVariants(sp02, "256GB Titanium Black", "SAM-GS24U-256-BK", 0, 15, "512GB Titanium Violet", "SAM-GS24U-512-VT", 100, 10);
        AddVariants(sp03, "128GB Obsidian", "GOO-PX8P-128-OB", 0, 15, "256GB Porcelain", "GOO-PX8P-256-PO", 100, 12);
        AddVariants(sp04, "256GB Silky Black", "OPL-12-256-BK", 0, 18, "512GB Flowy Emerald", "OPL-12-512-EM", 100, 12);
        AddVariants(sp05, "256GB Black", "XMI-14P-256-BK", 0, 14, "512GB White", "XMI-14P-512-WH", 100, 10);
        AddVariants(sp06, "256GB Black", "SNY-X1VI-256-BK", 0, 10, "512GB Khaki Green", "SNY-X1VI-512-KG", 100, 8);
        AddVariants(sp07, "256GB Icy Blue", "SAM-GZF5-256-IB", 0, 10, "512GB Phantom Black", "SAM-GZF5-512-PB", 120, 8);
        AddVariants(sp08, "128GB Dark Gray", "NTH-PH2-128-DG", 0, 15, "256GB White", "NTH-PH2-256-WH", 50, 10);
        AddVariants(sp09, "256GB Wood Edition", "MOT-E50U-256-WD", 0, 12, "512GB Leather Black", "MOT-E50U-512-LB", 100, 10);
        AddVariants(sp10, "16GB / 256GB Black", "ASU-ROG8P-16-256", 0, 8, "24GB / 1TB Black", "ASU-ROG8P-24-1TB", 300, 5);
        AddVariants(sp11, "128GB Black", "APL-IP15-128-BK", 0, 25, "256GB Pink", "APL-IP15-256-PK", 100, 20);
        AddVariants(sp12, "128GB Awesome Navy", "SAM-GA55-128-NV", 0, 25, "256GB Awesome Lilac", "SAM-GA55-256-LL", 50, 20);
        AddVariants(sp13, "128GB Aloe", "GOO-PX8A-128-AL", 0, 20, "256GB Bay", "GOO-PX8A-256-BY", 60, 15);
        AddVariants(sp14, "512GB Green", "HUA-P70U-512-GR", 0, 6, "1TB Black", "HUA-P70U-1TB-BK", 200, 4);
        AddVariants(sp15, "256GB Transparent Black", "FPH-5-256-TB", 0, 10, "256GB Sky Blue", "FPH-5-256-SB", 0, 10);

        // Laptops
        AddVariants(lp01, "18GB RAM / 512GB SSD Space Black", "APL-MBP14-18-512-SB", 0, 10, "36GB RAM / 1TB SSD Silver", "APL-MBP14-36-1TB-SV", 600, 7);
        AddVariants(lp02, "i7 / 16GB / 512GB", "DEL-XPS15-I7-16-512", 0, 8, "i9 / 32GB / 1TB", "DEL-XPS15-I9-32-1TB", 400, 5);
        AddVariants(lp03, "i5 / 16GB / 512GB", "LEN-X1C-I5-16-512", 0, 8, "i7 / 32GB / 1TB", "LEN-X1C-I7-32-1TB", 400, 5);
        AddVariants(lp04, "16GB / 1TB Eclipse Gray", "ASU-ROGZ16-16-1TB-EG", 0, 7, "32GB / 2TB Platinum White", "ASU-ROGZ16-32-2TB-PW", 400, 4);
        AddVariants(lp05, "16GB / 512GB Nightfall Black", "HP-SPX360-16-512", 0, 8, "32GB / 1TB Nightfall Black", "HP-SPX360-32-1TB", 300, 6);
        AddVariants(lp06, "8GB / 256GB Midnight", "APL-MBA15-8-256-MN", 0, 15, "16GB / 512GB Starlight", "APL-MBA15-16-512-SL", 200, 10);
        AddVariants(lp07, "32GB / 1TB Black", "RZR-BLD16-32-1TB", 0, 5, "64GB / 2TB Black", "RZR-BLD16-64-2TB", 600, 3);
        AddVariants(lp08, "Ryzen 7 / No dGPU", "FWK-LP16-R7-INT", 0, 6, "Ryzen 7 / RX 7700S", "FWK-LP16-R7-7700S", 400, 4);
        AddVariants(lp09, "32GB / 1TB Storm Grey", "LEN-YP9I-32-1TB-SG", 0, 8, "32GB / 2TB Tidal Teal", "LEN-YP9I-32-2TB-TT", 200, 5);
        AddVariants(lp10, "16GB / 512GB Platinum", "MSF-SL6-16-512-PT", 0, 10, "32GB / 1TB Sapphire", "MSF-SL6-32-1TB-SP", 300, 8);
        AddVariants(lp11, "16GB / 512GB Silver", "ACR-SG14-16-512-SV", 0, 14, "16GB / 1TB Silver", "ACR-SG14-16-1TB-SV", 100, 10);
        AddVariants(lp12, "32GB / 1TB Shadow Black", "HP-OMEN17-32-1TB", 0, 6, "64GB / 2TB Shadow Black", "HP-OMEN17-64-2TB", 400, 3);
        AddVariants(lp13, "32GB / 1TB Moonstone Gray", "SAM-GB4U-32-1TB-MG", 0, 7, "32GB / 2TB Moonstone Gray", "SAM-GB4U-32-2TB-MG", 200, 4);
        AddVariants(lp14, "16GB / 512GB Charcoal Gray", "LG-GRM17-16-512-CG", 0, 9, "16GB / 1TB White", "LG-GRM17-16-1TB-WH", 100, 6);
        AddVariants(lp15, "16GB / 512GB Black", "ACR-PHLN16-16-512", 0, 10, "32GB / 1TB Black", "ACR-PHLN16-32-1TB", 200, 6);

        // Tablets
        AddVariants(tb01, "256GB Wi-Fi Space Black", "APL-IPP13-256-WF-SB", 0, 10, "1TB Wi-Fi + 5G Silver", "APL-IPP13-1TB-5G-SV", 700, 4);
        AddVariants(tb02, "256GB Graphite Wi-Fi", "SAM-GTS9U-256-GY-WF", 0, 8, "512GB Graphite Wi-Fi + 5G", "SAM-GTS9U-512-GY-5G", 350, 4);
        AddVariants(tb03, "128GB Purple Wi-Fi", "APL-IPA11-128-PR-WF", 0, 15, "256GB Blue Wi-Fi", "APL-IPA11-256-BL-WF", 100, 12);
        AddVariants(tb04, "128GB Gray Wi-Fi", "SAM-GTS9FE-128-GY-WF", 0, 20, "256GB Mint Wi-Fi", "SAM-GTS9FE-256-MN-WF", 60, 15);
        AddVariants(tb05, "128GB Storm Grey", "LEN-TP12P-128-SG", 0, 12, "256GB Storm Grey", "LEN-TP12P-256-SG", 80, 10);
        AddVariants(tb06, "16GB / 256GB Platinum", "MSF-SP10-16-256-PT", 0, 8, "32GB / 1TB Sapphire", "MSF-SP10-32-1TB-SP", 600, 4);
        AddVariants(tb07, "256GB Nimbus Gray", "OPL-PAD2-256-NG", 0, 10, "256GB Obsidian Dusk", "OPL-PAD2-256-OD", 0, 10);
        AddVariants(tb08, "64GB Silver Wi-Fi", "APL-IPD10-64-SV-WF", 0, 25, "256GB Blue Wi-Fi + 5G", "APL-IPD10-256-BL-5G", 200, 12);
        AddVariants(tb09, "256GB Graphite", "XMI-PAD6SP-256-GR", 0, 12, "512GB Graphite", "XMI-PAD6SP-512-GR", 100, 8);
        AddVariants(tb10, "64GB Gray", "AMZ-FMAX11-64-GY", 0, 30, "128GB Gray", "AMZ-FMAX11-128-GY", 50, 20);
        AddVariants(tb11, "256GB Dark Green", "HUA-MPP132-256-DG", 0, 7, "512GB White", "HUA-MPP132-512-WH", 150, 5);
        AddVariants(tb12, "128GB Hazel", "GOO-PXTAB-128-HZ", 0, 15, "256GB Porcelain", "GOO-PXTAB-256-PO", 100, 10);
        AddVariants(tb13, "64GB Space Gray Wi-Fi", "APL-IPMN6-64-SG-WF", 0, 14, "256GB Starlight Wi-Fi + 5G", "APL-IPMN6-256-SL-5G", 250, 8);
        AddVariants(tb14, "64GB Navy Wi-Fi", "SAM-GTA9P-64-NV-WF", 0, 25, "128GB Silver Wi-Fi", "SAM-GTA9P-128-SV-WF", 40, 20);
        AddVariants(tb15, "128GB Storm Grey", "LEN-TP11PG2-128-SG", 0, 10, "256GB Storm Grey", "LEN-TP11PG2-256-SG", 60, 8);

        // Audio
        AddVariants(au01, "Black", "SNY-WH1000XM5-BK", 0, 25, "Silver", "SNY-WH1000XM5-SV", 0, 15);
        AddVariants(au02, "White (USB-C)", "APL-APP2-UC", 0, 40, "White (Lightning)", "APL-APP2-LT", 0, 30);
        AddVariants(au03, "Black", "BSE-QCULT-BK", 0, 20, "Sandstone", "BSE-QCULT-SD", 0, 15);
        AddVariants(au04, "Black", "SEN-MOM4W-BK", 0, 18, "White", "SEN-MOM4W-WH", 0, 12);
        AddVariants(au05, "Black", "SNY-WF1000XM5-BK", 0, 28, "Platinum Silver", "SNY-WF1000XM5-PS", 0, 20);
        AddVariants(au06, "White", "SAM-GB3P-WH", 0, 25, "Silver", "SAM-GB3P-SV", 0, 20);
        AddVariants(au07, "Black", "SON-ERA300-BK", 0, 12, "White", "SON-ERA300-WH", 0, 10);
        AddVariants(au08, "Teal", "JBL-CHG5-TL", 0, 30, "Black", "JBL-CHG5-BK", 0, 30);
        AddVariants(au09, "Space Gray", "APL-APM-SG", 0, 15, "Silver", "APL-APM-SV", 0, 12);
        AddVariants(au10, "Black", "BYR-DT900PX-BK", 0, 12, "Gray", "BYR-DT900PX-GY", 0, 10);
        AddVariants(au11, "Black and Brass", "MRS-EMB2-BB", 0, 25, "Cream", "MRS-EMB2-CR", 0, 20);
        AddVariants(au12, "White", "NTH-EAR2-WH", 0, 20, "Black", "NTH-EAR2-BK", 0, 18);
        AddVariants(au13, "Black", "BSE-SLMAX-BK", 0, 15, "Blue Dusk", "BSE-SLMAX-BD", 0, 12);
        AddVariants(au14, "Black", "ATH-M50XBT2-BK", 0, 18, "Deep Sea", "ATH-M50XBT2-DS", 0, 12);
        AddVariants(au15, "Titanium Black", "JBR-ELT10-TB", 0, 20, "Cocoa", "JBR-ELT10-CO", 0, 15);

        // Wearables
        AddVariants(wr01, "41mm Midnight Aluminum", "APL-AWS9-41-MN", 0, 20, "45mm Silver Stainless Steel", "APL-AWS9-45-SS", 200, 7);
        AddVariants(wr02, "43mm Black", "SAM-GWC6-43-BK", 0, 18, "47mm Silver", "SAM-GWC6-47-SV", 50, 10);
        AddVariants(wr03, "47mm Carbon Gray DLC", "GRM-FNX7P-47-CG", 0, 8, "47mm Sapphire Solar", "GRM-FNX7P-47-SS", 300, 4);
        AddVariants(wr04, "49mm Natural Titanium", "APL-AWU2-49-NT", 0, 12, "49mm Black Titanium", "APL-AWU2-49-BT", 0, 10);
        AddVariants(wr05, "Champagne Gold", "GOO-PW2-CG", 0, 15, "Matte Black", "GOO-PW2-MB", 0, 12);
        AddVariants(wr06, "Obsidian Band", "FBT-CHG6-OB", 0, 22, "Coral Band", "FBT-CHG6-CO", 0, 18);
        AddVariants(wr07, "45mm Black", "GRM-VEN3-45-BK", 0, 14, "41mm Ivory", "GRM-VEN3-41-IV", 0, 10);
        AddVariants(wr08, "Onyx Band", "WHP-40-ONX", 0, 18, "Sandstone Band", "WHP-40-SND", 0, 14);
        AddVariants(wr09, "Size 8 Titanium Black", "SAM-GRNG-8-BK", 0, 10, "Size 10 Titanium Gold", "SAM-GRNG-10-GD", 0, 8);
        AddVariants(wr10, "Size 8 Silver", "OUR-RNG3-8-SV", 0, 14, "Size 10 Black", "OUR-RNG3-10-BK", 0, 12);
        AddVariants(wr11, "Sahara Sand", "AMZ-TRXU-SS", 0, 10, "Abyss Black", "AMZ-TRXU-AB", 0, 8);
        AddVariants(wr12, "46mm Black", "GRM-FR265-46-BK", 0, 12, "42mm Whitestone", "GRM-FR265-42-WS", 0, 10);
        AddVariants(wr13, "Black", "XMI-SB8P-BK", 0, 40, "Champagne Gold", "XMI-SB8P-CG", 0, 30);
        AddVariants(wr14, "38mm Rose Gold", "WTH-SW2-38-RG", 0, 9, "42mm Black", "WTH-SW2-42-BK", 0, 8);
        AddVariants(wr15, "Black Silicone", "CRS-PACE3-BK-SI", 0, 12, "White Nylon", "CRS-PACE3-WH-NY", 0, 8);

        // Accessories
        AddVariants(ac01, "White", "ANK-737MGO-WH", 0, 60, "Black", "ANK-737MGO-BK", 0, 60);
        AddVariants(ac02, "Graphite", "LGT-MXM3S-GR", 0, 35, "Pale Gray", "LGT-MXM3S-PG", 0, 30);
        AddVariants(ac03, "1TB Indigo Blue", "SAM-T7SSD-1TB-IN", 0, 30, "2TB Gray", "SAM-T7SSD-2TB-GY", 60, 20);
        AddVariants(ac04, "White with Touch ID", "APL-MKBTID-WH", 0, 25, "Black with Touch ID", "APL-MKBTID-BK", 0, 20);
        AddVariants(ac05, "Black", "ANK-PRM20K-BK", 0, 35, "White", "ANK-PRM20K-WH", 0, 25);
        AddVariants(ac06, "Carbon Black / Gateron Brown", "KEY-Q1PRO-CB-BR", 0, 18, "Shell White / Gateron Red", "KEY-Q1PRO-SW-RD", 0, 14);
        AddVariants(ac07, "Space Gray", "CLD-TS4-SG", 0, 10, "Silver", "CLD-TS4-SV", 0, 8);
        AddVariants(ac08, "Graphite", "LGT-MXKS-GR", 0, 28, "Pale Gray", "LGT-MXKS-PG", 0, 22);
        AddVariants(ac09, "White", "APL-PNPRO-WH", 0, 40, "USB-C variant", "APL-PNPRO-UC", 0, 30);
        AddVariants(ac10, "Matte Black", "DBR-GRIP-IP15P-MB", 0, 50, "Robot Camo", "DBR-GRIP-IP15P-RC", 0, 40);
        AddVariants(ac11, "1TB", "SDK-EXTP-1TB-STD", 0, 40, "512GB", "SDK-EXTP-512GB-STD", -40, 35);
        AddVariants(ac12, "Black", "BLK-BCP3IN1-BK", 0, 20, "White", "BLK-BCP3IN1-WH", 0, 15);
        AddVariants(ac13, "Black", "NMD-TRKCARD-BK", 0, 50, "White", "NMD-TRKCARD-WH", 0, 35);
        AddVariants(ac14, "Black", "UGR-NXD100W-BK", 0, 45, "White", "UGR-NXD100W-WH", 0, 35);
        AddVariants(ac15, "20L Charcoal", "PKD-EDBP-V2-20-CH", 0, 15, "30L Black", "PKD-EDBP-V2-30-BK", 30, 12);

        await context.ProductVariants.AddRangeAsync(variants);
        await context.SaveChangesAsync();

        // ── Product Images (3 per product = 270) ──────────────────────────────────
        // All IDs verified via Unsplash download redirect — guaranteed to show tech products
        string[] phoneImgs = [
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",  // iPhone 15 Pro Max
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",  // Samsung Galaxy S24
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",  // Google Pixel 8 Pro
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",  // smartphone flat lay
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",  // iPhone bokeh
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80",  // iPhone white side
            "https://images.unsplash.com/photo-1578242174372-e26b3681587f?w=600&q=80",  // dark phone workspace
            "https://images.unsplash.com/photo-1552068751-34cb5cf055b3?w=600&q=80",     // turned-on Android
            "https://images.unsplash.com/photo-1723054072995-af2b91c5cbb6?w=600&q=80",  // HUAWEI P60 close-up
            "https://images.unsplash.com/photo-1637190909375-85cd40d14161?w=600&q=80",  // OnePlus in box
            "https://images.unsplash.com/photo-1762769210108-379db88854ef?w=600&q=80",  // multi-camera phone
            "https://images.unsplash.com/photo-1621558272312-0877bf5241d7?w=600&q=80",  // person holding phone
            "https://images.unsplash.com/photo-1770238586572-3f3887b0dfd6?w=600&q=80"   // iPhone with cameras
        ];
        string[] laptopImgs = [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",  // MacBook Pro desk
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",  // open laptop minimal
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",     // ThinkPad-style laptop
            "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",  // dark laptop keyboard
            "https://images.unsplash.com/photo-1717765960938-58f2d7e2017f?w=600&q=80",  // silver Apple laptop
            "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=600&q=80",  // MacBook Pro white table
            "https://images.unsplash.com/photo-1659135890084-930731031f40?w=600&q=80",  // MacBook Air M2 + mouse
            "https://images.unsplash.com/photo-1656639969809-ebc544c96955?w=600&q=80",  // gaming laptop screen
            "https://images.unsplash.com/photo-1722503583716-ee384fed4593?w=600&q=80",  // MacBook office setup
            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&q=80",  // MacBook neon dark
            "https://images.unsplash.com/photo-1633933769681-dc8d28bdeb6d?w=600&q=80"   // laptop colorful studio
        ];
        string[] tabletImgs = [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",     // iPad on table
            "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",  // Samsung Galaxy Tab
            "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80",  // tablet + keyboard
            "https://images.unsplash.com/photo-1565443492615-7e3d2324d925?w=600&q=80",  // iPad with Apple Pencil 2
            "https://images.unsplash.com/photo-1544244015-9c72fd9c866d?w=600&q=80",     // iPad + Pencil gray table
            "https://images.unsplash.com/photo-1570117858976-9490649cbf83?w=600&q=80",  // black iPad + Pencil
            "https://images.unsplash.com/photo-1713492527322-471061e52516?w=600&q=80",  // iPad Pro M2 desk
            "https://images.unsplash.com/photo-1726726192249-f857cb658ed8?w=600&q=80",  // iPad + pencils stationery
            "https://images.unsplash.com/photo-1669691177924-f12fcc3cc540?w=600&q=80",  // iPad Pro on table
            "https://images.unsplash.com/photo-1571101628768-6bae026844b6?w=600&q=80",  // person holding tablet
            "https://images.unsplash.com/photo-1669691082535-da2bc1e1094f?w=600&q=80"   // tablet on table
        ];
        string[] audioImgs = [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",  // Sony WH-1000XM flatlay
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",  // AirPods Pro earbuds
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",     // over-ear headphones
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",  // Bose speaker
            "https://images.unsplash.com/photo-1511499271651-073325718d90?w=600&q=80",  // Sonos black speaker
            "https://images.unsplash.com/photo-1589273705736-1bd0a0bcf116?w=600&q=80",  // JBL Charge speaker
            "https://images.unsplash.com/photo-1520390244437-6f1c5eae66ff?w=600&q=80",  // Beats portable speaker
            "https://images.unsplash.com/photo-1579632179504-9a6b0653e56b?w=600&q=80",  // gray portable speaker
            "https://images.unsplash.com/photo-1542193810-9007c21cd37e?w=600&q=80",     // Bang & Olufsen speaker
            "https://images.unsplash.com/photo-1585061410035-a44c2b0d4077?w=600&q=80",  // Bose QC35 headphones
            "https://images.unsplash.com/photo-1567928513899-997d98489fbd?w=600&q=80",  // wireless headphones purple
            "https://images.unsplash.com/photo-1621208587196-0b2a7d2aeb03?w=600&q=80",  // Sony headphones silver
            "https://images.unsplash.com/photo-1616431842618-bdf65d9befd9?w=600&q=80"   // Sony headphones brown
        ];
        string[] wearableImgs = [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",  // classic watch flat
            "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",  // smartwatch face
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",  // fitness band wrist
            "https://images.unsplash.com/photo-1434494745656-1aea7daa8f6f?w=600&q=80",  // turned-on smartwatch
            "https://images.unsplash.com/photo-1568752172055-6961c4146efd?w=600&q=80",  // black smartwatch flat
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80",  // Apple Watch on wrist
            "https://images.unsplash.com/photo-1723622555972-37af178c623a?w=600&q=80",  // Samsung Galaxy Watch
            "https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&q=80",     // black smartwatch white bg
            "https://images.unsplash.com/photo-1434494817513-cc112a976e36?w=600&q=80",  // person operating watch
            "https://images.unsplash.com/photo-1758348844319-6ca57f0a8ea0?w=600&q=80",  // smartwatch topo map
            "https://images.unsplash.com/photo-1434494493852-d1871af5c0a6?w=600&q=80",  // man wearing smartwatch
            "https://images.unsplash.com/photo-1571126817476-92bf7da319c3?w=600&q=80",  // gadgets + smartwatch
            "https://images.unsplash.com/photo-1692658938459-1fb13a96637a?w=600&q=80"   // person holding smartwatch
        ];
        string[] accessoryImgs = [
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",  // USB cable flat
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",  // gaming mouse
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",  // mechanical keyboard
            "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",  // RGB keyboard
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",  // accessories flatlay
            "https://images.unsplash.com/photo-1554876194-024e06bbc3cf?w=600&q=80",     // Razer gaming mouse
            "https://images.unsplash.com/photo-1566748861876-c7e74c17eb5a?w=600&q=80",  // black mechanical keyboard
            "https://images.unsplash.com/photo-1520092352425-9699926a9b0b?w=600&q=80",  // keyboard macro close-up
            "https://images.unsplash.com/photo-1558742569-fe6d39d05837?w=600&q=80",     // ASUS ROG gaming keyboard
            "https://images.unsplash.com/photo-1668096202611-d236ccbd6741?w=600&q=80",  // keyboard + mouse combo
            "https://images.unsplash.com/photo-1525858907241-d230b66fb9fa?w=600&q=80",  // power bank
            "https://images.unsplash.com/photo-1575543419095-0b090628213f?w=600&q=80",  // phone on wireless charger
            "https://images.unsplash.com/photo-1542222216855-78ff1bcf9252?w=600&q=80",  // wireless charger pad
            "https://images.unsplash.com/photo-1693155257465-f29b58ecadaa?w=600&q=80"   // portable phone charger
        ];

        var images = new List<ProductImage>();

        // productIndex gives each product a unique main image (pool[idx % 15])
        // Gallery images are offset by +5 and +10 for visual variety across the 15-item pool
        void AddImages(Product p, string[] pool, int productIndex)
        {
            var offsets = new[] { 0, 5, 10 };
            for (int i = 0; i < 3; i++)
            {
                var url = pool[(productIndex + offsets[i]) % pool.Length];
                if (i == 0) p.ImageUrl = url; // keep Product.ImageUrl in sync with IsMain gallery entry
                images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = p.Id,
                    IsMain = i == 0,
                    DisplayOrder = i + 1,
                    ImageUrl = url
                });
            }
        }

        var spArr = new[] { sp01, sp02, sp03, sp04, sp05, sp06, sp07, sp08, sp09, sp10, sp11, sp12, sp13, sp14, sp15 };
        var lpArr = new[] { lp01, lp02, lp03, lp04, lp05, lp06, lp07, lp08, lp09, lp10, lp11, lp12, lp13, lp14, lp15 };
        var tbArr = new[] { tb01, tb02, tb03, tb04, tb05, tb06, tb07, tb08, tb09, tb10, tb11, tb12, tb13, tb14, tb15 };
        var auArr = new[] { au01, au02, au03, au04, au05, au06, au07, au08, au09, au10, au11, au12, au13, au14, au15 };
        var wrArr = new[] { wr01, wr02, wr03, wr04, wr05, wr06, wr07, wr08, wr09, wr10, wr11, wr12, wr13, wr14, wr15 };
        var acArr = new[] { ac01, ac02, ac03, ac04, ac05, ac06, ac07, ac08, ac09, ac10, ac11, ac12, ac13, ac14, ac15 };

        for (int j = 0; j < spArr.Length; j++) AddImages(spArr[j], phoneImgs, j);
        for (int j = 0; j < lpArr.Length; j++) AddImages(lpArr[j], laptopImgs, j);
        for (int j = 0; j < tbArr.Length; j++) AddImages(tbArr[j], tabletImgs, j);
        for (int j = 0; j < auArr.Length; j++) AddImages(auArr[j], audioImgs, j);
        for (int j = 0; j < wrArr.Length; j++) AddImages(wrArr[j], wearableImgs, j);
        for (int j = 0; j < acArr.Length; j++) AddImages(acArr[j], accessoryImgs, j);

        await context.ProductImages.AddRangeAsync(images);
        await context.SaveChangesAsync();

        // ── Customers (8) ─────────────────────────────────────────────────────────
        var c1 = new Customer { Id = Guid.NewGuid(), FirstName = "John",    LastName = "Doe",       Email = "john@example.com",       PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 415 555 0102", CreatedAt = now.AddDays(-60) };
        var c2 = new Customer { Id = Guid.NewGuid(), FirstName = "Sarah",   LastName = "Chen",      Email = "sarah.chen@example.com", PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 212 555 0198", CreatedAt = now.AddDays(-55) };
        var c3 = new Customer { Id = Guid.NewGuid(), FirstName = "Marcus",  LastName = "Johnson",   Email = "marcus.j@example.com",   PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 310 555 0147", CreatedAt = now.AddDays(-50) };
        var c4 = new Customer { Id = Guid.NewGuid(), FirstName = "Emily",   LastName = "Rodriguez", Email = "emily.r@example.com",    PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 305 555 0263", CreatedAt = now.AddDays(-45) };
        var c5 = new Customer { Id = Guid.NewGuid(), FirstName = "David",   LastName = "Kim",       Email = "david.kim@example.com",  PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 206 555 0384", CreatedAt = now.AddDays(-40) };
        var c6 = new Customer { Id = Guid.NewGuid(), FirstName = "Aisha",   LastName = "Patel",     Email = "aisha.p@example.com",    PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 512 555 0425", CreatedAt = now.AddDays(-35) };
        var c7 = new Customer { Id = Guid.NewGuid(), FirstName = "Lucas",   LastName = "Moreau",    Email = "lucas.m@example.com",    PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 617 555 0516", CreatedAt = now.AddDays(-30) };
        var c8 = new Customer { Id = Guid.NewGuid(), FirstName = "Yuki",    LastName = "Tanaka",    Email = "yuki.t@example.com",     PasswordHash = authService.HashPassword("Customer123!"), Phone = "+1 408 555 0637", CreatedAt = now.AddDays(-25) };

        var customers = new[] { c1, c2, c3, c4, c5, c6, c7, c8 };
        await context.Customers.AddRangeAsync(customers);

        // ── Addresses ─────────────────────────────────────────────────────────────
        var addresses = new List<Address>
        {
            new() { Id = Guid.NewGuid(), CustomerId = c1.Id, Label = "Home",   Street = "123 Tech Avenue",         City = "San Francisco",  State = "CA", ZipCode = "94105", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c1.Id, Label = "Work",   Street = "1 Infinite Loop",         City = "Cupertino",      State = "CA", ZipCode = "95014", Country = "United States", IsDefault = false },
            new() { Id = Guid.NewGuid(), CustomerId = c2.Id, Label = "Home",   Street = "456 Broadway",            City = "New York",       State = "NY", ZipCode = "10013", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c3.Id, Label = "Home",   Street = "789 Sunset Blvd",         City = "Los Angeles",    State = "CA", ZipCode = "90028", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c4.Id, Label = "Home",   Street = "101 Ocean Drive",         City = "Miami",          State = "FL", ZipCode = "33139", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c5.Id, Label = "Home",   Street = "202 Pine Street",         City = "Seattle",        State = "WA", ZipCode = "98101", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c6.Id, Label = "Home",   Street = "303 Congress Avenue",     City = "Austin",         State = "TX", ZipCode = "78701", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c7.Id, Label = "Home",   Street = "404 Beacon Street",       City = "Boston",         State = "MA", ZipCode = "02116", Country = "United States", IsDefault = true },
            new() { Id = Guid.NewGuid(), CustomerId = c8.Id, Label = "Home",   Street = "505 Innovation Way",      City = "San Jose",       State = "CA", ZipCode = "95110", Country = "United States", IsDefault = true },
        };
        await context.Addresses.AddRangeAsync(addresses);
        await context.SaveChangesAsync();

        // ── Orders (20) ───────────────────────────────────────────────────────────
        const string addr1 = "{\"street\":\"123 Tech Avenue\",\"city\":\"San Francisco\",\"state\":\"CA\",\"zipCode\":\"94105\",\"country\":\"United States\"}";
        const string addr2 = "{\"street\":\"456 Broadway\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10013\",\"country\":\"United States\"}";
        const string addr3 = "{\"street\":\"789 Sunset Blvd\",\"city\":\"Los Angeles\",\"state\":\"CA\",\"zipCode\":\"90028\",\"country\":\"United States\"}";
        const string addr4 = "{\"street\":\"101 Ocean Drive\",\"city\":\"Miami\",\"state\":\"FL\",\"zipCode\":\"33139\",\"country\":\"United States\"}";
        const string addr5 = "{\"street\":\"202 Pine Street\",\"city\":\"Seattle\",\"state\":\"WA\",\"zipCode\":\"98101\",\"country\":\"United States\"}";
        const string addr6 = "{\"street\":\"303 Congress Avenue\",\"city\":\"Austin\",\"state\":\"TX\",\"zipCode\":\"78701\",\"country\":\"United States\"}";
        const string addr7 = "{\"street\":\"404 Beacon Street\",\"city\":\"Boston\",\"state\":\"MA\",\"zipCode\":\"02116\",\"country\":\"United States\"}";
        const string addr8 = "{\"street\":\"505 Innovation Way\",\"city\":\"San Jose\",\"state\":\"CA\",\"zipCode\":\"95110\",\"country\":\"United States\"}";

        var o01 = new Order { Id = Guid.NewGuid(), CustomerId = c1.Id, OrderNumber = "CK-20260115-0001", Status = OrderStatus.Delivered,  SubTotal = 1448.00m,  ShippingCost = 0,    Tax = 0, Total = 1448.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr1, CreatedAt = now.AddDays(-55), UpdatedAt = now.AddDays(-48) };
        var o02 = new Order { Id = Guid.NewGuid(), CustomerId = c1.Id, OrderNumber = "CK-20260120-0001", Status = OrderStatus.Delivered,  SubTotal = 1999.00m,  ShippingCost = 0,    Tax = 0, Total = 1999.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr1, CreatedAt = now.AddDays(-50), UpdatedAt = now.AddDays(-43) };
        var o03 = new Order { Id = Guid.NewGuid(), CustomerId = c2.Id, OrderNumber = "CK-20260122-0001", Status = OrderStatus.Delivered,  SubTotal = 1299.00m,  ShippingCost = 0,    Tax = 0, Total = 1299.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr2, CreatedAt = now.AddDays(-48), UpdatedAt = now.AddDays(-41) };
        var o04 = new Order { Id = Guid.NewGuid(), CustomerId = c2.Id, OrderNumber = "CK-20260128-0001", Status = OrderStatus.Delivered,  SubTotal = 349.00m,   ShippingCost = 0,    Tax = 0, Total = 349.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr2, CreatedAt = now.AddDays(-42), UpdatedAt = now.AddDays(-36) };
        var o05 = new Order { Id = Guid.NewGuid(), CustomerId = c3.Id, OrderNumber = "CK-20260201-0001", Status = OrderStatus.Delivered,  SubTotal = 799.00m,   ShippingCost = 9.99m, Tax = 0, Total = 808.99m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr3, CreatedAt = now.AddDays(-39), UpdatedAt = now.AddDays(-32) };
        var o06 = new Order { Id = Guid.NewGuid(), CustomerId = c3.Id, OrderNumber = "CK-20260205-0001", Status = OrderStatus.Delivered,  SubTotal = 449.00m,   ShippingCost = 0,    Tax = 0, Total = 449.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr3, CreatedAt = now.AddDays(-35), UpdatedAt = now.AddDays(-28) };
        var o07 = new Order { Id = Guid.NewGuid(), CustomerId = c4.Id, OrderNumber = "CK-20260208-0001", Status = OrderStatus.Delivered,  SubTotal = 1199.00m,  ShippingCost = 0,    Tax = 0, Total = 1199.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr4, CreatedAt = now.AddDays(-32), UpdatedAt = now.AddDays(-25) };
        var o08 = new Order { Id = Guid.NewGuid(), CustomerId = c4.Id, OrderNumber = "CK-20260212-0001", Status = OrderStatus.Delivered,  SubTotal = 599.00m,   ShippingCost = 0,    Tax = 0, Total = 599.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr4, CreatedAt = now.AddDays(-28), UpdatedAt = now.AddDays(-22) };
        var o09 = new Order { Id = Guid.NewGuid(), CustomerId = c5.Id, OrderNumber = "CK-20260215-0001", Status = OrderStatus.Delivered,  SubTotal = 1899.00m,  ShippingCost = 0,    Tax = 0, Total = 1899.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr5, CreatedAt = now.AddDays(-25), UpdatedAt = now.AddDays(-18) };
        var o10 = new Order { Id = Guid.NewGuid(), CustomerId = c5.Id, OrderNumber = "CK-20260218-0001", Status = OrderStatus.Delivered,  SubTotal = 249.00m,   ShippingCost = 9.99m, Tax = 0, Total = 258.99m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr5, CreatedAt = now.AddDays(-22), UpdatedAt = now.AddDays(-16) };
        var o11 = new Order { Id = Guid.NewGuid(), CustomerId = c6.Id, OrderNumber = "CK-20260220-0001", Status = OrderStatus.Delivered,  SubTotal = 799.00m,   ShippingCost = 0,    Tax = 0, Total = 799.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr6, CreatedAt = now.AddDays(-20), UpdatedAt = now.AddDays(-14) };
        var o12 = new Order { Id = Guid.NewGuid(), CustomerId = c6.Id, OrderNumber = "CK-20260224-0001", Status = OrderStatus.Delivered,  SubTotal = 129.00m,   ShippingCost = 0,    Tax = 0, Total = 129.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr6, CreatedAt = now.AddDays(-16), UpdatedAt = now.AddDays(-10) };
        var o13 = new Order { Id = Guid.NewGuid(), CustomerId = c7.Id, OrderNumber = "CK-20260226-0001", Status = OrderStatus.Delivered,  SubTotal = 1299.00m,  ShippingCost = 0,    Tax = 0, Total = 1299.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr7, CreatedAt = now.AddDays(-14), UpdatedAt = now.AddDays(-8) };
        var o14 = new Order { Id = Guid.NewGuid(), CustomerId = c7.Id, OrderNumber = "CK-20260228-0001", Status = OrderStatus.Shipped,    SubTotal = 399.00m,   ShippingCost = 0,    Tax = 0, Total = 399.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr7, CreatedAt = now.AddDays(-12), UpdatedAt = now.AddDays(-8) };
        var o15 = new Order { Id = Guid.NewGuid(), CustomerId = c8.Id, OrderNumber = "CK-20260301-0001", Status = OrderStatus.Delivered,  SubTotal = 999.00m,   ShippingCost = 0,    Tax = 0, Total = 999.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr8, CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-4) };
        var o16 = new Order { Id = Guid.NewGuid(), CustomerId = c8.Id, OrderNumber = "CK-20260303-0001", Status = OrderStatus.Shipped,    SubTotal = 449.00m,   ShippingCost = 0,    Tax = 0, Total = 449.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr8, CreatedAt = now.AddDays(-8),  UpdatedAt = now.AddDays(-5) };
        var o17 = new Order { Id = Guid.NewGuid(), CustomerId = c1.Id, OrderNumber = "CK-20260305-0001", Status = OrderStatus.Processing, SubTotal = 1299.00m,  ShippingCost = 9.99m, Tax = 0, Total = 1308.99m, PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr1, CreatedAt = now.AddDays(-6),  UpdatedAt = now.AddDays(-5) };
        var o18 = new Order { Id = Guid.NewGuid(), CustomerId = c3.Id, OrderNumber = "CK-20260307-0001", Status = OrderStatus.Processing, SubTotal = 349.00m,   ShippingCost = 0,    Tax = 0, Total = 349.00m,   PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr3, CreatedAt = now.AddDays(-4),  UpdatedAt = now.AddDays(-3) };
        var o19 = new Order { Id = Guid.NewGuid(), CustomerId = c5.Id, OrderNumber = "CK-20260309-0001", Status = OrderStatus.Pending,    SubTotal = 199.00m,   ShippingCost = 9.99m, Tax = 0, Total = 208.99m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr5, CreatedAt = now.AddDays(-2),  UpdatedAt = now.AddDays(-2) };
        var o20 = new Order { Id = Guid.NewGuid(), CustomerId = c4.Id, OrderNumber = "CK-20260310-0001", Status = OrderStatus.Pending,    SubTotal = 1099.00m,  ShippingCost = 0,    Tax = 0, Total = 1099.00m,  PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addr4, CreatedAt = now.AddDays(-1),  UpdatedAt = now.AddDays(-1) };

        var orders = new[] { o01, o02, o03, o04, o05, o06, o07, o08, o09, o10, o11, o12, o13, o14, o15, o16, o17, o18, o19, o20 };
        await context.Orders.AddRangeAsync(orders);
        await context.SaveChangesAsync();

        // ── Order Items ───────────────────────────────────────────────────────────
        var orderItems = new List<OrderItem>
        {
            // o01 — c1: iPhone + AirPods Pro
            new() { Id = Guid.NewGuid(), OrderId = o01.Id, ProductId = sp01.Id, ProductName = sp01.Name, VariantName = "256GB Natural Titanium", UnitPrice = 1199.00m, Quantity = 1, Total = 1199.00m },
            new() { Id = Guid.NewGuid(), OrderId = o01.Id, ProductId = au02.Id, ProductName = au02.Name, VariantName = "White (USB-C)", UnitPrice = 249.00m, Quantity = 1, Total = 249.00m },
            // o02 — c1: MacBook Pro
            new() { Id = Guid.NewGuid(), OrderId = o02.Id, ProductId = lp01.Id, ProductName = lp01.Name, VariantName = "18GB RAM / 512GB SSD Space Black", UnitPrice = 1999.00m, Quantity = 1, Total = 1999.00m },
            // o03 — c2: Galaxy S24 Ultra
            new() { Id = Guid.NewGuid(), OrderId = o03.Id, ProductId = sp02.Id, ProductName = sp02.Name, VariantName = "256GB Titanium Black", UnitPrice = 1299.00m, Quantity = 1, Total = 1299.00m },
            // o04 — c2: Sony WH-1000XM5
            new() { Id = Guid.NewGuid(), OrderId = o04.Id, ProductId = au01.Id, ProductName = au01.Name, VariantName = "Black", UnitPrice = 349.00m, Quantity = 1, Total = 349.00m },
            // o05 — c3: Apple Watch Ultra 2
            new() { Id = Guid.NewGuid(), OrderId = o05.Id, ProductId = wr04.Id, ProductName = wr04.Name, VariantName = "49mm Natural Titanium", UnitPrice = 799.00m, Quantity = 1, Total = 799.00m },
            // o06 — c3: Garmin Forerunner 265
            new() { Id = Guid.NewGuid(), OrderId = o06.Id, ProductId = wr12.Id, ProductName = wr12.Name, VariantName = "46mm Black", UnitPrice = 449.00m, Quantity = 1, Total = 449.00m },
            // o07 — c4: iPad Pro 13" M4
            new() { Id = Guid.NewGuid(), OrderId = o07.Id, ProductId = tb01.Id, ProductName = tb01.Name, VariantName = "256GB Wi-Fi Space Black", UnitPrice = 1299.00m, Quantity = 1, Total = 1299.00m },
            // o08 — c4: Nothing Phone (2)
            new() { Id = Guid.NewGuid(), OrderId = o08.Id, ProductId = sp08.Id, ProductName = sp08.Name, VariantName = "256GB White", UnitPrice = 649.00m, Quantity = 1, Total = 649.00m },
            // o09 — c5: ROG Zephyrus G16
            new() { Id = Guid.NewGuid(), OrderId = o09.Id, ProductId = lp04.Id, ProductName = lp04.Name, VariantName = "16GB / 1TB Eclipse Gray", UnitPrice = 1899.00m, Quantity = 1, Total = 1899.00m },
            // o10 — c5: AirPods Pro
            new() { Id = Guid.NewGuid(), OrderId = o10.Id, ProductId = au02.Id, ProductName = au02.Name, VariantName = "White (USB-C)", UnitPrice = 249.00m, Quantity = 1, Total = 249.00m },
            // o11 — c6: Garmin Fenix 7 Pro
            new() { Id = Guid.NewGuid(), OrderId = o11.Id, ProductId = wr03.Id, ProductName = wr03.Name, VariantName = "47mm Carbon Gray DLC", UnitPrice = 799.00m, Quantity = 1, Total = 799.00m },
            // o12 — c6: Anker Prime Power Bank
            new() { Id = Guid.NewGuid(), OrderId = o12.Id, ProductId = ac05.Id, ProductName = ac05.Name, VariantName = "Black", UnitPrice = 129.00m, Quantity = 1, Total = 129.00m },
            // o13 — c7: ThinkPad X1 Carbon
            new() { Id = Guid.NewGuid(), OrderId = o13.Id, ProductId = lp03.Id, ProductName = lp03.Name, VariantName = "i7 / 32GB / 1TB", UnitPrice = 1699.00m, Quantity = 1, Total = 1699.00m },
            // o14 — c7: Apple Watch Series 9
            new() { Id = Guid.NewGuid(), OrderId = o14.Id, ProductId = wr01.Id, ProductName = wr01.Name, VariantName = "45mm Silver Stainless Steel", UnitPrice = 599.00m, Quantity = 1, Total = 599.00m },
            // o15 — c8: Pixel 8 Pro
            new() { Id = Guid.NewGuid(), OrderId = o15.Id, ProductId = sp03.Id, ProductName = sp03.Name, VariantName = "256GB Porcelain", UnitPrice = 1099.00m, Quantity = 1, Total = 1099.00m },
            // o16 — c8: Sennheiser Momentum 4
            new() { Id = Guid.NewGuid(), OrderId = o16.Id, ProductId = au04.Id, ProductName = au04.Name, VariantName = "Black", UnitPrice = 349.00m, Quantity = 1, Total = 349.00m },
            // o17 — c1: Samsung Galaxy Tab S9 Ultra (Processing)
            new() { Id = Guid.NewGuid(), OrderId = o17.Id, ProductId = tb02.Id, ProductName = tb02.Name, VariantName = "256GB Graphite Wi-Fi", UnitPrice = 1199.00m, Quantity = 1, Total = 1199.00m },
            // o18 — c3: Bose QC Ultra (Processing)
            new() { Id = Guid.NewGuid(), OrderId = o18.Id, ProductId = au03.Id, ProductName = au03.Name, VariantName = "Black", UnitPrice = 429.00m, Quantity = 1, Total = 429.00m },
            // o19 — c5: Keychron Q1 Pro (Pending)
            new() { Id = Guid.NewGuid(), OrderId = o19.Id, ProductId = ac06.Id, ProductName = ac06.Name, VariantName = "Carbon Black / Gateron Brown", UnitPrice = 199.00m, Quantity = 1, Total = 199.00m },
            // o20 — c4: OnePlus Pad 2 (Pending)
            new() { Id = Guid.NewGuid(), OrderId = o20.Id, ProductId = tb07.Id, ProductName = tb07.Name, VariantName = "256GB Nimbus Gray", UnitPrice = 549.00m, Quantity = 1, Total = 549.00m },
        };
        await context.OrderItems.AddRangeAsync(orderItems);
        await context.SaveChangesAsync();

        // ── Reviews (4-10 per product from 8 different customers) ─────────────────
        var reviews = new List<Review>();
        var rng = new Random(42); // deterministic seed for reproducibility

        string[][] reviewTemplates =
        [
            // Rating 5 templates: [title, comment]
            ["Exceeded expectations", "This product blew me away. Build quality is premium, performance is snappy, and it just works. Highly recommended for anyone looking for top-tier quality."],
            ["Absolutely love it", "From unboxing to daily use, everything about this product feels polished. The attention to detail is remarkable and I'd buy it again without hesitation."],
            ["Best purchase this year", "After researching for weeks, I pulled the trigger and couldn't be happier. It does everything advertised and then some. The value for money is outstanding."],
            ["Five stars, no question", "Perfect in every way that matters. Reliable, fast, and beautifully designed. This is the kind of product that makes you a loyal customer."],
            ["Worth every penny", "I was hesitant about the price but after using it daily for two weeks, it's clear this is a premium product. The experience is seamless and the quality is evident."],
            ["Outstanding quality", "Superb craftsmanship and performance. The specs don't do it justice — you have to experience it in person to appreciate how good it really is."],

            // Rating 4 templates
            ["Great product, minor nitpicks", "Very solid overall. Performance and build quality are excellent. A few small things could be improved but nothing that would stop me from recommending it."],
            ["Really good but not perfect", "I'm impressed with the core experience. There are a couple of areas where competitors do slightly better, but for the price and ecosystem it's a strong buy."],
            ["Solid performer", "Does exactly what I needed and does it well. The only reason I'm not giving five stars is that the price is a tad high for what you get, but the quality is undeniable."],
            ["Happy with my purchase", "Good design, reliable performance, and a pleasant user experience. There's room for improvement in a couple of areas but it delivers on its promises."],
            ["Very good, recommended", "This ticks most of the boxes I was looking for. Battery life could be better and the price could be lower, but the overall package is compelling."],

            // Rating 3 templates
            ["Decent but has trade-offs", "It's a solid mid-range offering. Does the basics well but doesn't particularly excel in any one area. Fine for the price but don't expect to be wowed."],
            ["Good enough for the price", "It works as described and the price is fair. Some fit and finish issues that you'd expect at this tier. Adequate for everyday use."],
            ["Mixed feelings", "Some aspects are really impressive while others feel underdeveloped. It's not bad by any means, but I expected more consistency at this price point."],
        ];

        // Products that were actually purchased (for IsVerifiedPurchase tracking)
        var purchasedProducts = new Dictionary<Guid, HashSet<Guid>>(); // customerId → set of productIds
        foreach (var oi in orderItems)
        {
            var order = orders.First(o => o.Id == oi.OrderId);
            if (order.Status == OrderStatus.Delivered)
            {
                if (!purchasedProducts.ContainsKey(order.CustomerId))
                    purchasedProducts[order.CustomerId] = new HashSet<Guid>();
                purchasedProducts[order.CustomerId].Add(oi.ProductId);
            }
        }

        foreach (var product in allProducts)
        {
            int reviewCount = rng.Next(4, 11); // 4-10 reviews
            var shuffledCustomers = customers.OrderBy(_ => rng.Next()).Take(reviewCount).ToArray();

            for (int i = 0; i < shuffledCustomers.Length; i++)
            {
                var cust = shuffledCustomers[i];
                // Weight ratings: mostly 4-5, some 3s
                int rating = rng.Next(100) switch
                {
                    < 50 => 5,   // 50% get 5 stars
                    < 85 => 4,   // 35% get 4 stars
                    _    => 3    // 15% get 3 stars
                };

                int templateIdx = rating switch
                {
                    5 => rng.Next(0, 6),
                    4 => rng.Next(6, 11),
                    _ => rng.Next(11, 14)
                };

                bool isVerified = purchasedProducts.ContainsKey(cust.Id) && purchasedProducts[cust.Id].Contains(product.Id);

                reviews.Add(new Review
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    CustomerId = cust.Id,
                    Rating = rating,
                    Title = reviewTemplates[templateIdx][0],
                    Comment = reviewTemplates[templateIdx][1],
                    IsVerifiedPurchase = isVerified,
                    CreatedAt = now.AddDays(-rng.Next(1, 55))
                });
            }
        }
        await context.Reviews.AddRangeAsync(reviews);

        await context.SaveChangesAsync();
    }
}