﻿namespace MontagGo.API.DTOs
{
    public class AddressDto
    {
        public int Id { get; set; }
        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string? AdditionalInfo { get; set; }
    }

}
