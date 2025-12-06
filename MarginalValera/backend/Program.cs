// using Microsoft.EntityFrameworkCore;
// using MarginalValera.Data;
// using Microsoft.OpenApi.Models;

// var builder = WebApplication.CreateBuilder(args);

// // Настройка DbContext с PostgreSQL
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// // Добавление сервисов Swagger с аннотациями
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(c =>
// {
//     c.EnableAnnotations(); // для использования [SwaggerOperation] и [SwaggerParameter]
    
//     c.SwaggerDoc("v1", new OpenApiInfo
//     {
//         Title = "Marginal Valera API",
//         Version = "v1",
//         Description = "API для работы с Валерами"
//     });
// });

// builder.Services.AddControllers();

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
//     });
// });

// var app = builder.Build();

// app.UseCors(); // Добавить перед app.MapControllers()

// // Swagger в development
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(c =>
//     {
//         c.SwaggerEndpoint("/swagger/v1/swagger.json", "Marginal Valera API v1");
//     });
// }

// //app.UseHttpsRedirection();
// app.MapControllers();

// app.Run();
using Microsoft.EntityFrameworkCore;
using MarginalValera.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Настройка DbContext с PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавление сервисов Swagger с аннотациями
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

builder.Services.AddControllers();

// Настройка CORS для фронтенда React
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

app.UseCors(); // Включаем CORS

// Swagger в development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Marginal Valera API v1");
    });
}

// Обработка API URL, которых не существует
// app.Use(async (context, next) =>
// {
//     await next();

//     if (context.Response.StatusCode == 404 && context.Request.Path.StartsWithSegments("/api"))
//     {
//         context.Response.ContentType = "application/json";
//         await context.Response.WriteAsync("{\"error\":\"API endpoint not found\"}");
//     }
// });

//app.UseHttpsRedirection();

app.MapControllers();

app.Run();
