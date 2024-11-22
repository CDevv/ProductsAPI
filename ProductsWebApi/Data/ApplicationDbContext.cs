using Microsoft.EntityFrameworkCore;

namespace ProductsWebApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Product>? Products { get; set; }
    }
}
