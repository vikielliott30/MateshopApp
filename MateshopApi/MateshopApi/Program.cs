using MateshopApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(o => o.AddPolicy("MyPolicy", policyBuilder =>
{
    policyBuilder.AllowAnyOrigin()
                 .AllowAnyMethod()
                 .AllowAnyHeader();
}));

// 1) Resolver la cadena de conexión
//   - Primero intenta leer la variable de entorno "cnn-string-qa" (Azure).
//   - Si no está, usa DefaultConnection de appsettings.json (local).
var connectionString = Environment.GetEnvironmentVariable("cnn-string-qa");

if (string.IsNullOrEmpty(connectionString))
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException(
        "No se encontró cadena de conexión. " +
        "Configure la variable de entorno 'cnn-string-qa' o la conexión 'DefaultConnection' en appsettings.json."
    );
}

// 2) Registrar el DbContext usando SIEMPRE la connectionString resuelta arriba
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3) Crear la base de datos y tablas si no existen
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated(); // crea MateshopDB y sus tablas si no existen

        Console.WriteLine("Base de datos creada exitosamente o ya existía.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al crear la base de datos: {ex.Message}");
    }
}

// 4) Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
