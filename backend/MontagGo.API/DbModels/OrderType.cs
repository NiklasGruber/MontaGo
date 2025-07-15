using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace MontagGo.API.DbModels
{
    public class OrderType : TrackableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }  // e.g., "Installation", "Maintenance", "Repair"
        public string? Description { get; set; }

        public string ColorHex { get; set; } = "#000000"; // Default to black

        [NotMapped]
        public Color Color => ColorTranslator.FromHtml(ColorHex);


        // Optional: Link back to orders
        public List<Order> Orders { get; set; } = new();
    }
}
