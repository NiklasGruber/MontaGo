namespace MontagGo.API.DbModels
{
    public class Address : TrackableEntity
    {
        public int Id { get; set; }

        public string Street { get; set; }
        public string HouseNumber { get; set; }

        public string PostalCode { get; set; }
        public string City { get; set; }

        public string Country { get; set; }

        // Optional: Zusatzinfos (z.B. Stockwerk, Türnummer etc.)
        public string? AdditionalInfo { get; set; }
    }
}
