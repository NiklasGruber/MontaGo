namespace MontagGo.API.DTOs
{
    public class CustomerDto
    {
        public int Id { get; set; }

        public string CompanyName { get; set; } = string.Empty;

        public string ContactPerson { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public int AddressId { get; set; }
    }
}
