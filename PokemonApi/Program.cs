var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpClient("PokeApi", client =>
{
    client.BaseAddress = new Uri("https://pokeapi.co/api/v2/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReactApp");
app.MapControllers();

app.Run();
