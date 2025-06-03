namespace MontagGo.API.DbModels
{
    public class Worker : TrackableEntity
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Role { get; set; } // e.g., "Technician", "Supervisor"

        // Optional: Reference to assigned orders
        public List<Order> AssignedOrders { get; set; } = new();
    }
}
