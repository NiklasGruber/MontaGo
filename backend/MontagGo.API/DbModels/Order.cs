namespace MontagGo.API.DbModels
{
    public class Order : TrackableEntity
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<int> Items { get; set; } = new();

        // 🔗 Billing Address
        public int BillingAddressId { get; set; }

        // 🔗 Delivery Address
        public int DeliveryAddressId { get; set; }

        // 🔗 Order Type
        public int OrderTypeId { get; set; }

        // 🔗 Assigned Workers
        public List<int> AssignedWorkers { get; set; } = new();

        public double Value { get; set; }
    }
}
