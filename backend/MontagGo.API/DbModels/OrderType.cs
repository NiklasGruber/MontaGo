namespace MontagGo.API.DbModels
{
    public class OrderType : TrackableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }  // e.g., "Installation", "Maintenance", "Repair"
        public string? Description { get; set; }

        // Optional: Link back to orders
        public List<Order> Orders { get; set; } = new();
    }
}
