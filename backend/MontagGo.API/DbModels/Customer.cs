using System.ComponentModel.DataAnnotations;

namespace MontagGo.API.DbModels
{
    public class Customer : TrackableEntity
    {
        public int Id { get; set; }

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;
    }
}
