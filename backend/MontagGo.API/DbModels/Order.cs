namespace MontagGo.API.DbModels
{
    public class Order : TrackableEntity
    {
        public int Id { get; set; }

        public string CustomerName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<OrderItem> Items { get; set; } = new();

        // 🔗 Billing Address
        public int BillingAddressId { get; set; }
        public Address BillingAddress { get; set; }

        // 🔗 Delivery Address
        public int DeliveryAddressId { get; set; }
        public Address DeliveryAddress { get; set; }

        // 🔗 Order Type
        public int OrderTypeId { get; set; }
        public OrderType OrderType { get; set; }

        // 🔗 Assigned Workers
        public List<Worker> AssignedWorkers { get; set; } = new();
    }
}
