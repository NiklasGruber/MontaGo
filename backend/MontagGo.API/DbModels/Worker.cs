using System.ComponentModel.DataAnnotations.Schema;

namespace MontagGo.API.DbModels
{
    public class Worker : TrackableEntity
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }


        public int? RoleId { get; set; }  // Foreign Key
        public Role Role { get; set; }   // Navigation Property

        // Optional: Reference to assigned orders
        public List<Order> AssignedOrders { get; set; } = new();
    }
}
