using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddCors(options => {
    options.AddPolicy("ReactPolicy", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddHttpClient("WordPress", client => {
    client.BaseAddress = new Uri("http://localhost:8080/wp-json/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("ReactPolicy");

// Authentication endpoint
app.MapPost("/api/auth/login", async (LoginRequest request) => {
    // TODO: Add actual user validation
    return Results.Ok(new { 
        success = true, 
        token = "sample-jwt-token", 
        username = request.Username 
    });
});

// Company data endpoints
app.MapGet("/api/companies", async (IHttpClientFactory clientFactory) => {
    var client = clientFactory.CreateClient("WordPress");
    var response = await client.GetAsync("wp/v2/company?per_page=100");
    return await response.Content.ReadAsStringAsync();
});

app.MapGet("/api/companies/{id}/logo", async (int id, IHttpClientFactory clientFactory) => {
    var client = clientFactory.CreateClient("WordPress");
    var response = await client.GetAsync($"wp/v2/media/{id}");
    return await response.Content.ReadAsStringAsync();
});

app.Run();

public record LoginRequest(string Username, string Password);
