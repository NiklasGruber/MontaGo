using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MontagGo.API.Models;
using MontagGo.API.Services;
using Microsoft.OpenApi.Models;
using System.Text;
using MontagGo.API.Mapper;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.FileProviders;


var builder = WebApplication.CreateBuilder(args);
Console.WriteLine(">>> ENVIRONMENT: " + builder.Environment.EnvironmentName);

var MyAllowSpecificOrigins = "_MontagoSpecificCORS";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Listen(System.Net.IPAddress.Loopback, 5000); // Forces IPv4
});

// ?? Swagger mit JWT-Support
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Montago API", Version = "v1" });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "JWT Authorization header using the Bearer scheme.",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// ?? DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//CORS
MyAllowSpecificOrigins = "_MontagoCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins("https://montago.onrender.com")
                                .WithOrigins("http://localhost:5173", "http://[::1]:5173")
                .AllowAnyHeader()
                .AllowCredentials()
                .AllowAnyMethod();
        });
});


// ?? JWT Auth
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]);

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
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

// ?? Services
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(80); // wichtig für Docker
});

var app = builder.Build();

// ?? Migration (nur dev)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ?? Swagger aktivieren
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ?? Middleware
app.UseDefaultFiles();

var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();
var logger = loggerFactory.CreateLogger("Montago");
if (app.Environment.IsDevelopment())
{
    var path = Path.Combine(
        Directory.GetParent(Directory.GetCurrentDirectory())!.Parent!.FullName,
        "frontend", "MontagoFrontend");

    var fileProvider = new PhysicalFileProvider(path);

    logger.LogInformation($"[DEV] Serving frontend from: {fileProvider.Root}");

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = fileProvider,
        RequestPath = ""
    });
}
else
{
    // Render / Docker build: Frontend liegt direkt in /app/frontend
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "frontend")),
        RequestPath = ""
    });
}
app.UseCors(MyAllowSpecificOrigins);

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SPA-Fallback nach Routing
app.MapFallbackToFile("/index.html");
app.Run();
