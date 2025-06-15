using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using online_personal_finance_dashboard.Data;
using online_personal_finance_dashboard.Config;
using online_personal_finance_dashboard.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Read JWT settings from appsettings.json
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// 2️⃣ Register Controllers
// Apply [Authorize] to ALL controllers by default
builder.Services.AddControllers(options => 
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser() // Requires ANY authenticated user
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

// 3️⃣ Register EF Core DbContext
builder.Services.AddDbContext<FinancialAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultDbContext")));

// 4️⃣ Register ASP.NET Identity with your custom User + Role
builder.Services.AddIdentity<User, Role>(options =>
{
    // Example: configure password rules here if needed
})
.AddEntityFrameworkStores<FinancialAppDbContext>()
.AddDefaultTokenProviders();

// 5️⃣ Register JWT Authentication — this is CRUCIAL
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
    };

    // Optional: Custom 401 message
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            var result = System.Text.Json.JsonSerializer.Serialize(new { message = "Unauthorized" });
            return context.Response.WriteAsync(result);
        }
    };
});

// 6️⃣ Register Authorization
builder.Services.AddAuthorization();

// 7️⃣ Register Swagger with JWT Bearer support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Online Personal Finance Dashboard",
        Version = "v1",
        Description = "API for secure personal finance management."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT: Bearer {your token here}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference 
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 8️⃣ Allow CORS if needed
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Build the app
var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAll");

// 🔑 ORDER MATTERS: 
// Authentication FIRST, then Authorization
app.UseAuthentication();
app.UseAuthorization();

// Optional: show JSON errors for 401, 403, 404
app.UseStatusCodePages();

// Map API routes
app.MapControllers();

app.Run();
