using System.ComponentModel.DataAnnotations;

namespace MontagGo.API.DbModels
{
    public class Customer : TrackableEntity
    {
        public int Id { get; set; }

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        public string ContactPerson { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public int AddressId { get; set; }
        public Address Address { get; set; }
    }
}
