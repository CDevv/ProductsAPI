using Microsoft.EntityFrameworkCore;
using ProductsWebApi.Data;

namespace ProductsWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors((options) =>
            {
                options.AddPolicy("Allow", (policy) =>
                {
                    policy.WithOrigins("https://127.0.0.1:5500")
                    .WithOrigins("http://127.0.0.1:5500")
                    .AllowAnyHeader().AllowCredentials().AllowAnyMethod();
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

            app.UseAuthorization();

            app.UseCors("Allow");


            app.MapControllers();

            app.Run();
        }
    }
}