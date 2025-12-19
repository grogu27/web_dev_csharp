using Microsoft.EntityFrameworkCore;
using MarginalValera.Data;
using Microsoft.OpenApi.Models;
using MarginalValera.Services;

var builder = WebApplication.CreateBuilder(args);

// Настройка DbContext с PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Регистрация сервисов
builder.Services.AddScoped<ValeraService>();
builder.Services.AddScoped<AuthService>(); // <- добавлено

builder.Services.AddControllers();

// Настройка Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations(); // для использования [SwaggerOperation] и [SwaggerParameter]

    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Marginal Valera API",
        Version = "v1",
        Description = "API для работы с Валерами"
    });
});

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Marginal Valera API v1");
    });
}

app.MapControllers();

app.Run();
