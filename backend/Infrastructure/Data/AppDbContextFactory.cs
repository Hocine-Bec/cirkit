using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Data;

/// <summary>
/// Design-time factory for EF Core migrations. Reads DEFAULTCONNECTION from the .env file
/// or environment variable — no need to set a connection string in appsettings.json.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("DEFAULTCONNECTION")
            ?? TryReadFromEnvFile();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }

    private static string TryReadFromEnvFile()
    {
        var searchDirs = new[]
        {
            Directory.GetCurrentDirectory(),
            Path.Combine(Directory.GetCurrentDirectory(), ".."),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "Presentation")
        };

        foreach (var dir in searchDirs)
        {
            var envFile = Path.GetFullPath(Path.Combine(dir, ".env"));
            if (!File.Exists(envFile)) continue;

            foreach (var line in File.ReadLines(envFile))
            {
                if (line.StartsWith("DEFAULTCONNECTION=", StringComparison.Ordinal))
                    return line["DEFAULTCONNECTION=".Length..].Trim();
            }
        }

        // Fallback for local development
        return "Host=localhost;Port=5432;Database=cirkit;Username=postgres;Password=postgres";
    }
}
