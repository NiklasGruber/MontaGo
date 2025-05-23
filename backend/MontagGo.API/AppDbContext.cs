using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;

namespace MontagGo.API
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Orders> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Modellanpassungen hier
        }
    }
}
