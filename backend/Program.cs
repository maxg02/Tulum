using backend.Data;
using backend.Repositories.Interfaces;
using backend.Repositories.Repos;
using backend.Utilities.Classes;
using backend.Utilities.Interfaces;
using backend.Utilities.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options => { options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Expense Control App API",
            Version = "v1"
        });
        options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme."
        });
        options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "bearerAuth"
                }
            },
            new string[] {}
        }
    });
    });
}

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.Configure<JwtInfo>(builder.Configuration.GetSection("Jwt"));
var jwtInfo = builder.Configuration.GetSection("Jwt").Get<JwtInfo>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtInfo!.Issuer,
            ValidAudience = jwtInfo!.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtInfo!.SigningKey))
        };
    });

builder.Services.AddScoped<IIncomeRepo, IncomeRepo>();
builder.Services.AddScoped<IExpenseCategoryRepo, ExpenseCategoryRepo>();
builder.Services.AddScoped<IBudgetPlanRepo, BudgetPlanRepo>();
builder.Services.AddScoped<IExpenseRepo, ExpenseRepo>();
builder.Services.AddScoped<ISavingGoalRepo, SavingGoalRepo>();
builder.Services.AddScoped<IGoalContributionRepo, GoalContributionRepo>();
builder.Services.AddScoped<IAuthRepo, AuthRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IClaimsAccess, ClaimsAccess>();
builder.Services.AddHttpContextAccessor();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod();

    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
