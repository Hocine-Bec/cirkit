using System.Text;
using Application.Extensions;
using DotNetEnv;
using Infrastructure.Extensions;
using Infrastructure.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Application layer (services, validators, Mapster)
builder.Services.AddApplicationServices();

// Infrastructure layer (DbContext, UoW, AuthService, MockPaymentService)
builder.Services.AddInfrastructure();

// JWT Authentication
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? throw new InvalidOperationException("JWT_SECRET_KEY not configured");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "CirKit";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "CirKitUsers";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// CORS — allow React frontend from env
var allowedOrigins = new List<string>();
var corsOrigin = Environment.GetEnvironmentVariable("CORS_ORIGIN");
if (!string.IsNullOrWhiteSpace(corsOrigin))
    allowedOrigins.AddRange(corsOrigin.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(o => o.TrimEnd('/')));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// OpenAPI + Scalar
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, ct) =>
    {
        document.Info = new()
        {
            Title = "CirKit API",
            Version = "v1",
            Description = "Electronics E-Commerce API — Products, Orders, Customers, Admin Panel"
        };
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// ──────────────────────────────────────────────
// MIDDLEWARE PIPELINE
// ──────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/scalar/", options =>
    {
        options.Title = "CirKit API";
        options.AddPreferredSecuritySchemes("Bearer");
        options.AddHttpAuthentication("Bearer", _ => { });
    });
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ──────────────────────────────────────────────
// DATABASE — migrate then seed
// ──────────────────────────────────────────────

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.AppDbContext>();
    await db.Database.MigrateAsync();
}

await DatabaseSeeder.SeedAsync(app.Services);

app.Run();
