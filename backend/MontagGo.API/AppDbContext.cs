using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSets
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Worker> Workers { get; set; }
    public DbSet<OrderType> OrderTypes { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Role> Roles { get; set; }

    public DbSet<Product> Products { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Worker -> Role relationship
        modelBuilder.Entity<Worker>()
     .HasOne(w => w.Role)
     .WithMany()
     .HasForeignKey(w => w.RoleId)
     .OnDelete(DeleteBehavior.Restrict);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<TrackableEntity>();

        foreach (var entry in entries)
        {
            var now = DateTime.UtcNow;
            var user = GetCurrentUsername(); // <- du kannst das anpassen

            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = user;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = user;
                    break;

                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.DeletedAt = now;
                    entry.Entity.DeletedBy = user;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    private string GetCurrentUsername()
    {
        // Beispiel: hole User aus JWT oder Kontext
        return "system"; // später z. B. über IHttpContextAccessor
    }


}
