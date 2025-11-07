using Microsoft.EntityFrameworkCore;
using MarginalValera.Data;

var builder = WebApplication.CreateBuilder(args);
// Настройка DbContext с PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

// Добавление сервисов Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddOpenApi();

builder.Services.AddControllers();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    
    app.UseSwagger();
    app.UseSwaggerUI();

}

//app.UseHttpsRedirection();
app.MapControllers();


app.Run();
