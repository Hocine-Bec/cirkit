using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Seeding;

/// <summary>
/// Seeds the database with demo data on first run. Idempotent — skips if users already exist.
/// Default admin: admin@cirkit.com / Admin123!
/// Default customer: john@example.com / Customer123!
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
        var tablets     = new Category { Id = Guid.NewGuid(), Name = "Tablets",      Slug = "tablets",      Description = "Tablets for creativity and entertainment",      ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", DisplayOrder = 3 };
        var audio       = new Category { Id = Guid.NewGuid(), Name = "Audio",        Slug = "audio",        Description = "Premium headphones, earbuds, and speakers",     ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", DisplayOrder = 4 };
        var wearables   = new Category { Id = Guid.NewGuid(), Name = "Wearables",    Slug = "wearables",    Description = "Smartwatches and fitness trackers",             ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", DisplayOrder = 5 };
        var accessories = new Category { Id = Guid.NewGuid(), Name = "Accessories",  Slug = "accessories",  Description = "Cases, cables, chargers, and peripherals",      ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", DisplayOrder = 6 };

        await context.Categories.AddRangeAsync(smartphones, laptops, tablets, audio, wearables, accessories);
        await context.SaveChangesAsync();

        // ── Products ──────────────────────────────────────────────────────────────
        // Smartphones (4)
        var iphone = new Product
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
        var galaxyS24 = new Product
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
        var pixel8 = new Product
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
        var oneplus12 = new Product
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

        // Laptops (3)
        var macbookPro = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "MacBook Pro 14\" M3 Pro", Slug = "macbook-pro-14-m3-pro",
            Description = "MacBook Pro with M3 Pro chip delivers extraordinary performance for demanding workflows. With up to 18-hour battery life, Liquid Retina XDR display, and up to 36GB of unified memory, it's the ultimate professional laptop for developers, video editors, and creative pros.",
            ShortDescription = "M3 Pro chip, Liquid Retina XDR, up to 36GB unified memory",
            BasePrice = 1999.00m, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Brand = "Apple", Sku = "APL-MBP14-M3P", StockQuantity = 25, IsFeatured = true,
            Specifications = "{\"Display\":\"14.2\\\" Liquid Retina XDR 120Hz\",\"Chip\":\"Apple M3 Pro\",\"Memory\":\"18GB Unified (base)\",\"Storage\":\"512GB SSD (base)\",\"Battery\":\"Up to 18 hours\",\"Ports\":\"3x Thunderbolt 4, HDMI, SD, MagSafe\",\"Weight\":\"1.61kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var dellXps15 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Dell XPS 15", Slug = "dell-xps-15",
            Description = "The Dell XPS 15 combines stunning OLED display technology with Intel Core i7/i9 performance and NVIDIA GeForce RTX graphics. With a near-borderless InfinityEdge display and precision-crafted aluminum chassis, it's the premium Windows laptop for creative professionals.",
            ShortDescription = "OLED InfinityEdge display, Intel Core i7, NVIDIA RTX 4060",
            BasePrice = 1499.00m, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Brand = "Dell", Sku = "DEL-XPS15", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Display\":\"15.6\\\" 3.5K OLED 60Hz\",\"Processor\":\"Intel Core i7-13700H\",\"Memory\":\"16GB DDR5 (base)\",\"Storage\":\"512GB NVMe SSD\",\"GPU\":\"NVIDIA RTX 4060 8GB\",\"Battery\":\"86Wh\",\"Weight\":\"1.86kg\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var thinkpad = new Product
        {
            Id = Guid.NewGuid(), CategoryId = laptops.Id,
            Name = "Lenovo ThinkPad X1 Carbon", Slug = "lenovo-thinkpad-x1-carbon",
            Description = "The ThinkPad X1 Carbon Gen 11 is the ultimate ultrabook for business professionals. Under 1.12kg, MIL-SPEC tested, with Intel Evo certification and up to 15 hours battery life. Features the legendary ThinkPad keyboard and a stunning 2.8K OLED display option.",
            ShortDescription = "Under 1.12kg, Intel Evo certified, 15hr battery, legendary keyboard",
            BasePrice = 1299.00m, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
            Brand = "Lenovo", Sku = "LEN-X1C11", StockQuantity = 18, IsFeatured = false,
            Specifications = "{\"Display\":\"14\\\" 2.8K OLED 60Hz\",\"Processor\":\"Intel Core i7-1365U\",\"Memory\":\"16GB LPDDR5 (base)\",\"Storage\":\"512GB NVMe SSD\",\"Battery\":\"Up to 15 hours\",\"Weight\":\"1.12kg\",\"Certifications\":\"Intel Evo, MIL-SPEC 810H\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // Tablets (2)
        var ipadPro = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "iPad Pro 12.9\" M2", Slug = "ipad-pro-12-m2",
            Description = "iPad Pro with M2 chip takes performance to a whole new level. The Liquid Retina XDR display with ProMotion delivers extreme brightness and nano-texture glass for stunning visuals. With Wi-Fi 6E and optional 5G, you stay connected wherever you create.",
            ShortDescription = "M2 chip, Liquid Retina XDR, nano-texture glass, Wi-Fi 6E",
            BasePrice = 1099.00m, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Brand = "Apple", Sku = "APL-IPP12-M2", StockQuantity = 22, IsFeatured = true,
            Specifications = "{\"Display\":\"12.9\\\" Liquid Retina XDR 120Hz\",\"Chip\":\"Apple M2\",\"Storage\":\"128GB (base)\",\"Cameras\":\"12MP Wide + 10MP Ultra Wide + LiDAR\",\"Connectivity\":\"Wi-Fi 6E + optional 5G\",\"Weight\":\"682g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var galaxyTab = new Product
        {
            Id = Guid.NewGuid(), CategoryId = tablets.Id,
            Name = "Samsung Galaxy Tab S9 Ultra", Slug = "samsung-galaxy-tab-s9-ultra",
            Description = "Galaxy Tab S9 Ultra is the ultimate creative tablet with a massive 14.6\" Dynamic AMOLED 2X display and included S Pen. Powered by Snapdragon 8 Gen 2, it's IP68 water-resistant and features dual front cameras perfect for video calls.",
            ShortDescription = "14.6\" Dynamic AMOLED 2X, S Pen included, Snapdragon 8 Gen 2",
            BasePrice = 1199.00m, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GTS9U", StockQuantity = 15, IsFeatured = true,
            Specifications = "{\"Display\":\"14.6\\\" Dynamic AMOLED 2X 120Hz\",\"Chip\":\"Snapdragon 8 Gen 2\",\"Storage\":\"256GB (base)\",\"Cameras\":\"13MP + 8MP Rear | 12MP + 12MP Front\",\"Connectivity\":\"Wi-Fi 6E + optional 5G\",\"Rating\":\"IP68\",\"Weight\":\"732g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // Audio (3)
        var sonyWH = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Sony WH-1000XM5", Slug = "sony-wh-1000xm5",
            Description = "Industry-leading noise cancellation with the new Integrated Processor V1. Eight microphones and two processors work together to block out distractions. With 30-hour battery life, Multipoint connection for two devices simultaneously, and exceptional sound quality.",
            ShortDescription = "Industry-leading ANC, 30hr battery, Multipoint dual-device connection",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
            Brand = "Sony", Sku = "SNY-WH1000XM5", StockQuantity = 60, IsFeatured = true,
            Specifications = "{\"Type\":\"Over-ear\",\"Driver\":\"30mm\",\"ANC\":\"Yes — 8 microphones\",\"Battery\":\"30 hours (ANC on)\",\"Charging\":\"USB-C, 3hr full charge\",\"Bluetooth\":\"5.2 with LDAC\",\"Weight\":\"250g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var airpodsPro = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Apple AirPods Pro (2nd Gen)", Slug = "airpods-pro-2nd-gen",
            Description = "AirPods Pro (2nd generation) feature the H2 chip for up to 2x more Active Noise Cancellation than the previous generation. Adaptive Audio continuously controls the level of noise cancellation based on your environment. Personalized Spatial Audio with dynamic head tracking.",
            ShortDescription = "H2 chip, 2x ANC, Adaptive Audio, Personalized Spatial Audio",
            BasePrice = 249.00m, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
            Brand = "Apple", Sku = "APL-APP2", StockQuantity = 80, IsFeatured = true,
            Specifications = "{\"Type\":\"In-ear\",\"Chip\":\"Apple H2\",\"ANC\":\"Adaptive ANC\",\"Battery\":\"6hr earbuds + 30hr case\",\"Charging\":\"MagSafe / Lightning / USB-C\",\"Bluetooth\":\"5.3\",\"Rating\":\"IPX4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var boseQC45 = new Product
        {
            Id = Guid.NewGuid(), CategoryId = audio.Id,
            Name = "Bose QuietComfort 45", Slug = "bose-quietcomfort-45",
            Description = "The Bose QuietComfort 45 headphones combine world-class noise cancellation with high-fidelity audio and all-day comfort. TriPort acoustic architecture and volume-optimized Active EQ deliver full, rich sound at any volume level.",
            ShortDescription = "World-class noise cancellation, TriPort acoustics, 24hr battery",
            BasePrice = 329.00m, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
            Brand = "Bose", Sku = "BSE-QC45", StockQuantity = 45, IsFeatured = false,
            Specifications = "{\"Type\":\"Over-ear\",\"ANC\":\"Yes — Quiet Mode\",\"Ambient Mode\":\"Yes — Aware Mode\",\"Battery\":\"24 hours\",\"Charging\":\"USB-C, 2.5hr full charge\",\"Bluetooth\":\"5.1\",\"Weight\":\"238g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // Wearables (3)
        var appleWatch = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Apple Watch Series 9", Slug = "apple-watch-series-9",
            Description = "Apple Watch Series 9 introduces the S9 chip for faster processing and a new Double Tap gesture. The brighter Always-On Retina display is now 2000 nits. Carbon neutral options available. Advanced health features include ECG, blood oxygen, crash detection, and temperature sensing.",
            ShortDescription = "S9 chip, Double Tap gesture, 2000 nits display, ECG",
            BasePrice = 399.00m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            Brand = "Apple", Sku = "APL-AWS9", StockQuantity = 55, IsFeatured = true,
            Specifications = "{\"Case Sizes\":\"41mm or 45mm\",\"Chip\":\"Apple S9 SiP\",\"Display\":\"Always-On Retina LTPO OLED\",\"Health\":\"ECG, Blood Oxygen, Temperature, Crash Detection\",\"Battery\":\"Up to 18 hours\",\"Water Resistance\":\"50m\",\"Connectivity\":\"GPS + optional Cellular\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var galaxyWatch = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Samsung Galaxy Watch 6 Classic", Slug = "samsung-galaxy-watch-6-classic",
            Description = "The Galaxy Watch 6 Classic brings back the iconic rotating bezel for intuitive navigation. With Samsung BioActive Sensor for comprehensive health tracking, advanced sleep coaching, and Wear OS 4 with Galaxy AI features, it's the most capable Galaxy Watch yet.",
            ShortDescription = "Rotating bezel, BioActive Sensor, advanced sleep coaching, Wear OS 4",
            BasePrice = 349.00m, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-GWC6", StockQuantity = 38, IsFeatured = false,
            Specifications = "{\"Case Sizes\":\"43mm or 47mm\",\"Display\":\"Super AMOLED\",\"Processor\":\"Exynos W930\",\"Sensors\":\"BioActive (HR, SpO2, ECG, Bioelectrical Impedance)\",\"Battery\":\"300mAh (43mm) / 425mAh (47mm)\",\"Water Resistance\":\"5ATM + IP68\",\"OS\":\"Wear OS 4\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var garminFenix = new Product
        {
            Id = Guid.NewGuid(), CategoryId = wearables.Id,
            Name = "Garmin Fenix 7 Pro", Slug = "garmin-fenix-7-pro",
            Description = "The Garmin Fenix 7 Pro is the ultimate adventure smartwatch. Built-in LED flashlight, solar charging capability, and multi-band GPS for pinpoint accuracy in challenging environments. Topographic maps, ski maps, and golf course maps are preloaded. Up to 22 days battery life.",
            ShortDescription = "LED flashlight, solar charging, multi-band GPS, 22-day battery",
            BasePrice = 799.00m, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            Brand = "Garmin", Sku = "GRM-FNX7P", StockQuantity = 20, IsFeatured = false,
            Specifications = "{\"Case Size\":\"47mm (standard) / 51mm (X)\",\"Display\":\"1.3\\\" MIP with LED Backlight\",\"GPS\":\"Multi-band GPS/GNSS\",\"Battery\":\"Up to 22 days / 36 days solar\",\"Water Rating\":\"10 ATM\",\"Maps\":\"Topographic, Ski, Golf\",\"Sensors\":\"HR, SpO2, Stress, Body Battery\"}",
            CreatedAt = now, UpdatedAt = now
        };

        // Accessories (3)
        var ankerCharger = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Anker 737 MagGo Charger", Slug = "anker-737-maggo-charger",
            Description = "The Anker 737 MagGo charger delivers 15W MagSafe-compatible wireless charging for iPhone 12 and later. Features a foldable design for portability, USB-C power input, and a built-in stand that props your phone at the perfect angle for FaceTime and content viewing.",
            ShortDescription = "15W MagSafe-compatible, foldable stand, USB-C input",
            BasePrice = 59.00m, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
            Brand = "Anker", Sku = "ANK-737MGO", StockQuantity = 120, IsFeatured = false,
            Specifications = "{\"Charging\":\"15W MagSafe-compatible Qi2\",\"Input\":\"USB-C 20W\",\"Compatibility\":\"iPhone 12 and later\",\"Design\":\"Foldable stand\",\"Cable\":\"5ft USB-C included\",\"Weight\":\"57g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var logitechMX = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Logitech MX Master 3S", Slug = "logitech-mx-master-3s",
            Description = "The MX Master 3S is the most advanced Master Series mouse with Quiet Clicks that reduce click noise by 90% while delivering the same satisfying feel. MagSpeed electromagnetic scrolling, 8K DPI Darkfield sensor, and comfortable ergonomic design for all-day productivity.",
            ShortDescription = "90% quieter clicks, MagSpeed scrolling, 8K DPI, ergonomic",
            BasePrice = 99.00m, ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
            Brand = "Logitech", Sku = "LGT-MXM3S", StockQuantity = 90, IsFeatured = false,
            Specifications = "{\"Sensor\":\"Darkfield 8000 DPI\",\"Buttons\":\"7 programmable\",\"Scrolling\":\"MagSpeed electromagnetic wheel\",\"Battery\":\"Up to 70 days per charge\",\"Connectivity\":\"Bluetooth + USB Receiver\",\"Compatibility\":\"Windows, macOS, Linux, iPadOS\",\"Weight\":\"141g\"}",
            CreatedAt = now, UpdatedAt = now
        };
        var samsungSSD = new Product
        {
            Id = Guid.NewGuid(), CategoryId = accessories.Id,
            Name = "Samsung T7 Portable SSD", Slug = "samsung-t7-portable-ssd",
            Description = "The Samsung T7 delivers NVMe speeds up to 1,050 MB/s in a compact, pocket-sized metal design. With AES 256-bit hardware encryption and password protection, your data stays secure. Compatible with USB 3.2 Gen 2 for maximum transfer speeds.",
            ShortDescription = "Up to 1,050 MB/s, AES 256-bit encryption, compact metal design",
            BasePrice = 89.00m, ImageUrl = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
            Brand = "Samsung", Sku = "SAM-T7SSD", StockQuantity = 75, IsFeatured = false,
            Specifications = "{\"Interface\":\"USB 3.2 Gen 2 (10Gbps)\",\"Read Speed\":\"Up to 1,050 MB/s\",\"Write Speed\":\"Up to 1,000 MB/s\",\"Security\":\"AES 256-bit hardware encryption\",\"Connector\":\"USB-C (USB-A adapter included)\",\"Shock Resistance\":\"2m drop\",\"Weight\":\"58g\"}",
            CreatedAt = now, UpdatedAt = now
        };

        await context.Products.AddRangeAsync(
            iphone, galaxyS24, pixel8, oneplus12,
            macbookPro, dellXps15, thinkpad,
            ipadPro, galaxyTab,
            sonyWH, airpodsPro, boseQC45,
            appleWatch, galaxyWatch, garminFenix,
            ankerCharger, logitechMX, samsungSSD
        );
        await context.SaveChangesAsync();

        // ── Variants ──────────────────────────────────────────────────────────────
        var variants = new List<ProductVariant>
        {
            // iPhone 15 Pro Max
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, Name = "256GB Natural Titanium", Sku = "APL-IP15PM-256-NT", PriceModifier = 0,   StockQuantity = 18 },
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, Name = "256GB Blue Titanium",    Sku = "APL-IP15PM-256-BT", PriceModifier = 0,   StockQuantity = 12 },
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, Name = "512GB Natural Titanium", Sku = "APL-IP15PM-512-NT", PriceModifier = 100, StockQuantity = 12 },
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, Name = "1TB Natural Titanium",   Sku = "APL-IP15PM-1TB-NT", PriceModifier = 300, StockQuantity = 8  },

            // Galaxy S24 Ultra
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, Name = "256GB Titanium Black",  Sku = "SAM-GS24U-256-BK", PriceModifier = 0,   StockQuantity = 15 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, Name = "256GB Titanium Gray",   Sku = "SAM-GS24U-256-GY", PriceModifier = 0,   StockQuantity = 10 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, Name = "512GB Titanium Violet", Sku = "SAM-GS24U-512-VT", PriceModifier = 100, StockQuantity = 10 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, Name = "1TB Titanium Black",    Sku = "SAM-GS24U-1TB-BK", PriceModifier = 250, StockQuantity = 5  },

            // Pixel 8 Pro
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id, Name = "128GB Obsidian",  Sku = "GOO-PX8P-128-OB", PriceModifier = 0,   StockQuantity = 15 },
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id, Name = "256GB Porcelain", Sku = "GOO-PX8P-256-PO", PriceModifier = 100, StockQuantity = 12 },
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id, Name = "512GB Bay",       Sku = "GOO-PX8P-512-BY", PriceModifier = 200, StockQuantity = 8  },

            // OnePlus 12
            new() { Id = Guid.NewGuid(), ProductId = oneplus12.Id, Name = "256GB Silky Black",   Sku = "OPL-12-256-BK", PriceModifier = 0,   StockQuantity = 18 },
            new() { Id = Guid.NewGuid(), ProductId = oneplus12.Id, Name = "512GB Flowy Emerald", Sku = "OPL-12-512-EM", PriceModifier = 100, StockQuantity = 12 },

            // MacBook Pro 14
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, Name = "18GB RAM / 512GB SSD",  Sku = "APL-MBP14-18-512", PriceModifier = 0,   StockQuantity = 10 },
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, Name = "36GB RAM / 512GB SSD",  Sku = "APL-MBP14-36-512", PriceModifier = 400, StockQuantity = 8  },
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, Name = "36GB RAM / 1TB SSD",    Sku = "APL-MBP14-36-1TB", PriceModifier = 600, StockQuantity = 7  },

            // Dell XPS 15
            new() { Id = Guid.NewGuid(), ProductId = dellXps15.Id, Name = "i7 / 16GB / 512GB",  Sku = "DEL-XPS15-I7-16-512", PriceModifier = 0,   StockQuantity = 8 },
            new() { Id = Guid.NewGuid(), ProductId = dellXps15.Id, Name = "i7 / 32GB / 1TB",    Sku = "DEL-XPS15-I7-32-1TB", PriceModifier = 300, StockQuantity = 7 },
            new() { Id = Guid.NewGuid(), ProductId = dellXps15.Id, Name = "i9 / 64GB / 2TB",    Sku = "DEL-XPS15-I9-64-2TB", PriceModifier = 600, StockQuantity = 5 },

            // ThinkPad X1 Carbon
            new() { Id = Guid.NewGuid(), ProductId = thinkpad.Id, Name = "i5 / 16GB / 512GB", Sku = "LEN-X1C11-I5-16-512", PriceModifier = 0,   StockQuantity = 8 },
            new() { Id = Guid.NewGuid(), ProductId = thinkpad.Id, Name = "i7 / 32GB / 1TB",   Sku = "LEN-X1C11-I7-32-1TB", PriceModifier = 400, StockQuantity = 5 },

            // iPad Pro 12.9
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id, Name = "128GB Wi-Fi",              Sku = "APL-IPP12-128-WF",   PriceModifier = 0,   StockQuantity = 10 },
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id, Name = "256GB Wi-Fi",              Sku = "APL-IPP12-256-WF",   PriceModifier = 100, StockQuantity = 8  },
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id, Name = "512GB Wi-Fi",              Sku = "APL-IPP12-512-WF",   PriceModifier = 200, StockQuantity = 4  },

            // Galaxy Tab S9 Ultra
            new() { Id = Guid.NewGuid(), ProductId = galaxyTab.Id, Name = "256GB Graphite Wi-Fi",          Sku = "SAM-GTS9U-256-GY-WF", PriceModifier = 0,   StockQuantity = 8 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyTab.Id, Name = "512GB Graphite Wi-Fi",          Sku = "SAM-GTS9U-512-GY-WF", PriceModifier = 200, StockQuantity = 5 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyTab.Id, Name = "256GB Graphite Wi-Fi + 5G",     Sku = "SAM-GTS9U-256-GY-5G", PriceModifier = 150, StockQuantity = 4 },

            // Sony WH-1000XM5
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id, Name = "Black",        Sku = "SNY-WH1000XM5-BK", PriceModifier = 0, StockQuantity = 30 },
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id, Name = "Midnight Blue", Sku = "SNY-WH1000XM5-MB", PriceModifier = 0, StockQuantity = 20 },
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id, Name = "Silver",        Sku = "SNY-WH1000XM5-SV", PriceModifier = 0, StockQuantity = 10 },

            // AirPods Pro
            new() { Id = Guid.NewGuid(), ProductId = airpodsPro.Id, Name = "White with MagSafe Case (Lightning)", Sku = "APL-APP2-LT", PriceModifier = 0, StockQuantity = 40 },
            new() { Id = Guid.NewGuid(), ProductId = airpodsPro.Id, Name = "White with MagSafe Case (USB-C)",     Sku = "APL-APP2-UC", PriceModifier = 0, StockQuantity = 40 },

            // Bose QC45
            new() { Id = Guid.NewGuid(), ProductId = boseQC45.Id, Name = "Black",        Sku = "BSE-QC45-BK", PriceModifier = 0,  StockQuantity = 20 },
            new() { Id = Guid.NewGuid(), ProductId = boseQC45.Id, Name = "White Smoke",  Sku = "BSE-QC45-WS", PriceModifier = 0,  StockQuantity = 15 },
            new() { Id = Guid.NewGuid(), ProductId = boseQC45.Id, Name = "Eclipse Grey", Sku = "BSE-QC45-EG", PriceModifier = 20, StockQuantity = 10 },

            // Apple Watch S9
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, Name = "41mm Midnight Aluminum",        Sku = "APL-AWS9-41-MN", PriceModifier = 0,   StockQuantity = 20 },
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, Name = "45mm Midnight Aluminum",        Sku = "APL-AWS9-45-MN", PriceModifier = 50,  StockQuantity = 18 },
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, Name = "41mm Starlight Aluminum",       Sku = "APL-AWS9-41-SL", PriceModifier = 0,   StockQuantity = 10 },
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, Name = "45mm Silver Stainless Steel",   Sku = "APL-AWS9-45-SS", PriceModifier = 200, StockQuantity = 7  },

            // Galaxy Watch 6 Classic
            new() { Id = Guid.NewGuid(), ProductId = galaxyWatch.Id, Name = "43mm Black",  Sku = "SAM-GWC6-43-BK", PriceModifier = 0,  StockQuantity = 18 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyWatch.Id, Name = "47mm Black",  Sku = "SAM-GWC6-47-BK", PriceModifier = 50, StockQuantity = 12 },
            new() { Id = Guid.NewGuid(), ProductId = galaxyWatch.Id, Name = "47mm Silver", Sku = "SAM-GWC6-47-SV", PriceModifier = 50, StockQuantity = 8  },

            // Garmin Fenix 7 Pro
            new() { Id = Guid.NewGuid(), ProductId = garminFenix.Id, Name = "47mm Carbon Gray DLC",  Sku = "GRM-FNX7P-47-CG", PriceModifier = 0,   StockQuantity = 8 },
            new() { Id = Guid.NewGuid(), ProductId = garminFenix.Id, Name = "51mm Carbon Gray DLC",  Sku = "GRM-FNX7P-51-CG", PriceModifier = 100, StockQuantity = 6 },
            new() { Id = Guid.NewGuid(), ProductId = garminFenix.Id, Name = "47mm Sapphire Solar",   Sku = "GRM-FNX7P-47-SS", PriceModifier = 300, StockQuantity = 4 },

            // Anker Charger
            new() { Id = Guid.NewGuid(), ProductId = ankerCharger.Id, Name = "White", Sku = "ANK-737MGO-WH", PriceModifier = 0, StockQuantity = 60 },
            new() { Id = Guid.NewGuid(), ProductId = ankerCharger.Id, Name = "Black", Sku = "ANK-737MGO-BK", PriceModifier = 0, StockQuantity = 60 },

            // Logitech MX Master 3S
            new() { Id = Guid.NewGuid(), ProductId = logitechMX.Id, Name = "Graphite",         Sku = "LGT-MXM3S-GR", PriceModifier = 0, StockQuantity = 35 },
            new() { Id = Guid.NewGuid(), ProductId = logitechMX.Id, Name = "Pale Gray",         Sku = "LGT-MXM3S-PG", PriceModifier = 0, StockQuantity = 30 },
            new() { Id = Guid.NewGuid(), ProductId = logitechMX.Id, Name = "Performance Red",   Sku = "LGT-MXM3S-RD", PriceModifier = 0, StockQuantity = 25 },

            // Samsung T7 SSD
            new() { Id = Guid.NewGuid(), ProductId = samsungSSD.Id, Name = "1TB Beige",  Sku = "SAM-T7SSD-1TB-BE", PriceModifier = 0,  StockQuantity = 30 },
            new() { Id = Guid.NewGuid(), ProductId = samsungSSD.Id, Name = "1TB Indigo", Sku = "SAM-T7SSD-1TB-IN", PriceModifier = 0,  StockQuantity = 25 },
            new() { Id = Guid.NewGuid(), ProductId = samsungSSD.Id, Name = "2TB Beige",  Sku = "SAM-T7SSD-2TB-BE", PriceModifier = 60, StockQuantity = 20 },
        };
        await context.ProductVariants.AddRangeAsync(variants);

        // ── Product Images ────────────────────────────────────────────────────────
        var images = new List<ProductImage>
        {
            // iPhone 15 Pro Max
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id, IsMain = false, DisplayOrder = 3, ImageUrl = "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80" },

            // Galaxy S24 Ultra
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id, IsMain = false, DisplayOrder = 3, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80" },

            // Pixel 8 Pro
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80" },

            // OnePlus 12
            new() { Id = Guid.NewGuid(), ProductId = oneplus12.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = oneplus12.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80" },

            // MacBook Pro 14
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, IsMain = false, DisplayOrder = 3, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80" },

            // Dell XPS 15
            new() { Id = Guid.NewGuid(), ProductId = dellXps15.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = dellXps15.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80" },

            // ThinkPad
            new() { Id = Guid.NewGuid(), ProductId = thinkpad.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = thinkpad.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80" },

            // iPad Pro
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80" },

            // Galaxy Tab S9 Ultra
            new() { Id = Guid.NewGuid(), ProductId = galaxyTab.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1632296397699-b5a68ba37f8c?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = galaxyTab.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80" },

            // Sony WH-1000XM5
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80" },

            // AirPods Pro
            new() { Id = Guid.NewGuid(), ProductId = airpodsPro.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = airpodsPro.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80" },

            // Bose QC45
            new() { Id = Guid.NewGuid(), ProductId = boseQC45.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = boseQC45.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },

            // Apple Watch S9
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80" },

            // Galaxy Watch 6
            new() { Id = Guid.NewGuid(), ProductId = galaxyWatch.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = galaxyWatch.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80" },

            // Garmin Fenix 7
            new() { Id = Guid.NewGuid(), ProductId = garminFenix.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80" },
            new() { Id = Guid.NewGuid(), ProductId = garminFenix.Id, IsMain = false, DisplayOrder = 2, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },

            // Anker Charger
            new() { Id = Guid.NewGuid(), ProductId = ankerCharger.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80" },

            // Logitech MX Master 3S
            new() { Id = Guid.NewGuid(), ProductId = logitechMX.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80" },

            // Samsung T7 SSD
            new() { Id = Guid.NewGuid(), ProductId = samsungSSD.Id, IsMain = true,  DisplayOrder = 1, ImageUrl = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80" },
        };
        await context.ProductImages.AddRangeAsync(images);

        // ── Sample Customer ───────────────────────────────────────────────────────
        var customer = new Customer
        {
            Id           = Guid.NewGuid(),
            FirstName    = "John",
            LastName     = "Doe",
            Email        = "john@example.com",
            PasswordHash = authService.HashPassword("Customer123!"),
            Phone        = "+1 415 555 0102",
            CreatedAt    = now.AddDays(-30)
        };
        await context.Customers.AddAsync(customer);

        var homeAddress = new Address
        {
            Id         = Guid.NewGuid(),
            CustomerId = customer.Id,
            Label      = "Home",
            Street     = "123 Tech Avenue",
            City       = "San Francisco",
            State      = "CA",
            ZipCode    = "94105",
            Country    = "United States",
            IsDefault  = true
        };
        var workAddress = new Address
        {
            Id         = Guid.NewGuid(),
            CustomerId = customer.Id,
            Label      = "Work",
            Street     = "1 Infinite Loop",
            City       = "Cupertino",
            State      = "CA",
            ZipCode    = "95014",
            Country    = "United States",
            IsDefault  = false
        };
        await context.Addresses.AddRangeAsync(homeAddress, workAddress);
        await context.SaveChangesAsync();

        // ── Sample Orders ─────────────────────────────────────────────────────────
        const string addrSnapshot = "{\"street\":\"123 Tech Avenue\",\"city\":\"San Francisco\",\"state\":\"CA\",\"zipCode\":\"94105\",\"country\":\"United States\"}";

        var order1 = new Order
        {
            Id = Guid.NewGuid(), CustomerId = customer.Id,
            OrderNumber = "CK-20260220-0001", Status = OrderStatus.Delivered,
            SubTotal = 1448.00m, ShippingCost = 0, Tax = 0, Total = 1448.00m,
            PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addrSnapshot,
            CreatedAt = now.AddDays(-25), UpdatedAt = now.AddDays(-20)
        };
        var order2 = new Order
        {
            Id = Guid.NewGuid(), CustomerId = customer.Id,
            OrderNumber = "CK-20260225-0001", Status = OrderStatus.Delivered,
            SubTotal = 1999.00m, ShippingCost = 0, Tax = 0, Total = 1999.00m,
            PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addrSnapshot,
            CreatedAt = now.AddDays(-15), UpdatedAt = now.AddDays(-10)
        };
        var order3 = new Order
        {
            Id = Guid.NewGuid(), CustomerId = customer.Id,
            OrderNumber = "CK-20260228-0001", Status = OrderStatus.Processing,
            SubTotal = 1299.00m, ShippingCost = 9.99m, Tax = 0, Total = 1308.99m,
            PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addrSnapshot,
            CreatedAt = now.AddDays(-6), UpdatedAt = now.AddDays(-5)
        };
        var order4 = new Order
        {
            Id = Guid.NewGuid(), CustomerId = customer.Id,
            OrderNumber = "CK-20260301-0001", Status = OrderStatus.Shipped,
            SubTotal = 349.00m, ShippingCost = 0, Tax = 0, Total = 349.00m,
            PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addrSnapshot,
            CreatedAt = now.AddDays(-4), UpdatedAt = now.AddDays(-3)
        };
        var order5 = new Order
        {
            Id = Guid.NewGuid(), CustomerId = customer.Id,
            OrderNumber = "CK-20260304-0001", Status = OrderStatus.Pending,
            SubTotal = 1099.00m, ShippingCost = 9.99m, Tax = 0, Total = 1108.99m,
            PaymentMethod = PaymentMethod.Mock, ShippingAddressSnapshot = addrSnapshot,
            CreatedAt = now.AddDays(-1), UpdatedAt = now.AddDays(-1)
        };
        await context.Orders.AddRangeAsync(order1, order2, order3, order4, order5);
        await context.SaveChangesAsync();

        // ── Order Items ───────────────────────────────────────────────────────────
        var orderItems = new List<OrderItem>
        {
            // Order 1 — iPhone + AirPods Pro (Delivered)
            new() { Id = Guid.NewGuid(), OrderId = order1.Id, ProductId = iphone.Id,     ProductName = iphone.Name,     VariantName = "256GB Natural Titanium", UnitPrice = 1199.00m, Quantity = 1, Total = 1199.00m },
            new() { Id = Guid.NewGuid(), OrderId = order1.Id, ProductId = airpodsPro.Id, ProductName = airpodsPro.Name, VariantName = "White with MagSafe Case (USB-C)", UnitPrice = 249.00m, Quantity = 1, Total = 249.00m },

            // Order 2 — MacBook Pro (Delivered)
            new() { Id = Guid.NewGuid(), OrderId = order2.Id, ProductId = macbookPro.Id, ProductName = macbookPro.Name, VariantName = "18GB RAM / 512GB SSD", UnitPrice = 1999.00m, Quantity = 1, Total = 1999.00m },

            // Order 3 — Galaxy S24 Ultra (Processing)
            new() { Id = Guid.NewGuid(), OrderId = order3.Id, ProductId = galaxyS24.Id, ProductName = galaxyS24.Name, VariantName = "256GB Titanium Black", UnitPrice = 1299.00m, Quantity = 1, Total = 1299.00m },

            // Order 4 — Sony WH-1000XM5 (Shipped)
            new() { Id = Guid.NewGuid(), OrderId = order4.Id, ProductId = sonyWH.Id, ProductName = sonyWH.Name, VariantName = "Black", UnitPrice = 349.00m, Quantity = 1, Total = 349.00m },

            // Order 5 — iPad Pro (Pending)
            new() { Id = Guid.NewGuid(), OrderId = order5.Id, ProductId = ipadPro.Id, ProductName = ipadPro.Name, VariantName = "128GB Wi-Fi", UnitPrice = 1099.00m, Quantity = 1, Total = 1099.00m },
        };
        await context.OrderItems.AddRangeAsync(orderItems);

        // ── Reviews ───────────────────────────────────────────────────────────────
        // From delivered orders: iphone, airpodsPro, macbookPro are verified purchases
        var reviews = new List<Review>
        {
            new() { Id = Guid.NewGuid(), ProductId = iphone.Id,     CustomerId = customer.Id, Rating = 5, Title = "Best iPhone ever",         Comment = "The titanium build feels premium and the camera system is absolutely incredible. Battery life improved significantly over my previous model. The A17 Pro handles everything effortlessly.",                           IsVerifiedPurchase = true,  CreatedAt = now.AddDays(-20) },
            new() { Id = Guid.NewGuid(), ProductId = airpodsPro.Id, CustomerId = customer.Id, Rating = 5, Title = "Noise cancellation is magic", Comment = "I wear these on flights and in coffee shops daily. The ANC is so good it almost feels eerie. Sound quality is excellent and the fit is comfortable for long sessions.",                              IsVerifiedPurchase = true,  CreatedAt = now.AddDays(-19) },
            new() { Id = Guid.NewGuid(), ProductId = macbookPro.Id, CustomerId = customer.Id, Rating = 5, Title = "Developer dream machine",     Comment = "Compiles code faster than any machine I've used. Running Xcode, Docker, and multiple browser tabs without breaking a sweat. The display is gorgeous and battery life is genuinely all-day.", IsVerifiedPurchase = true,  CreatedAt = now.AddDays(-9)  },
            new() { Id = Guid.NewGuid(), ProductId = galaxyS24.Id,  CustomerId = customer.Id, Rating = 4, Title = "Impressive camera, bulky form", Comment = "The 200MP camera and S Pen make this a productivity powerhouse. Slightly too large for one-handed use but the display is stunning. Battery life is excellent.",                             IsVerifiedPurchase = false, CreatedAt = now.AddDays(-5)  },
            new() { Id = Guid.NewGuid(), ProductId = sonyWH.Id,     CustomerId = customer.Id, Rating = 5, Title = "Worth every penny",           Comment = "After trying several noise-cancelling headphones, these are the best. The ANC is unmatched, sound quality is warm and detailed, and they're comfortable for 8+ hour sessions.",                   IsVerifiedPurchase = false, CreatedAt = now.AddDays(-3)  },
            new() { Id = Guid.NewGuid(), ProductId = ipadPro.Id,    CustomerId = customer.Id, Rating = 4, Title = "Great tablet, pricey ecosystem", Comment = "The hardware is phenomenal — M2 chip, stunning display, incredible build quality. The Apple Pencil and Magic Keyboard cost as much as the tablet itself though.",                           IsVerifiedPurchase = false, CreatedAt = now.AddDays(-1)  },
            new() { Id = Guid.NewGuid(), ProductId = appleWatch.Id, CustomerId = customer.Id, Rating = 5, Title = "My health companion",          Comment = "The Double Tap gesture is incredibly useful, the display is the brightest and sharpest I've seen on a smartwatch, and the health tracking features keep me accountable every day.",               IsVerifiedPurchase = false, CreatedAt = now.AddDays(-12) },
            new() { Id = Guid.NewGuid(), ProductId = pixel8.Id,     CustomerId = customer.Id, Rating = 4, Title = "Best Android camera",          Comment = "Google's computational photography is unmatched. Night Sight and astrophotography mode blow everything else away. The Tensor G3 handles AI features buttery smooth.",                           IsVerifiedPurchase = false, CreatedAt = now.AddDays(-8)  },
            new() { Id = Guid.NewGuid(), ProductId = logitechMX.Id, CustomerId = customer.Id, Rating = 5, Title = "Perfect productivity mouse",   Comment = "The MagSpeed scroll wheel is addictive — flick it and it spins for ages. Quiet clicks are a real thing. Tracks perfectly on any surface. Multi-device switching is seamless.",              IsVerifiedPurchase = false, CreatedAt = now.AddDays(-14) },
            new() { Id = Guid.NewGuid(), ProductId = samsungSSD.Id, CustomerId = customer.Id, Rating = 4, Title = "Fast and compact",             Comment = "Transfer speeds are exactly as advertised. The metal case feels premium and fits in any pocket. Password protection works well. My only wish is that it included a longer cable.",               IsVerifiedPurchase = false, CreatedAt = now.AddDays(-16) },
        };
        await context.Reviews.AddRangeAsync(reviews);

        await context.SaveChangesAsync();
    }
}
