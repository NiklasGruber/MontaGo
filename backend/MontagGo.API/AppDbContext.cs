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


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1:1 Delivery Address
        modelBuilder.Entity<Order>()
            .HasOne(o => o.DeliveryAddress)
            .WithMany()
            .HasForeignKey(o => o.DeliveryAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        // 1:1 Billing Address
        modelBuilder.Entity<Order>()
            .HasOne(o => o.BillingAddress)
            .WithMany()
            .HasForeignKey(o => o.BillingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        // 1:n OrderType
        modelBuilder.Entity<Order>()
            .HasOne(o => o.OrderType)
            .WithMany(t => t.Orders)
            .HasForeignKey(o => o.OrderTypeId);

        // n:m Assigned Workers
        modelBuilder.Entity<Order>()
            .HasMany(o => o.AssignedWorkers)
            .WithMany(w => w.AssignedOrders)
            .UsingEntity(j => j.ToTable("OrderWorkers"));
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
