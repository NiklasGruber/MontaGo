namespace MontagGo.API.DTOs
{
    public class OrderTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public string ColorHex { get; set; } // Hex color code, e.g., "#FF5733"
    }

}
