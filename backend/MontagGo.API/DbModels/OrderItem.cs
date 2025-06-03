namespace MontagGo.API.DbModels
{
    public class OrderItem : TrackableEntity
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}