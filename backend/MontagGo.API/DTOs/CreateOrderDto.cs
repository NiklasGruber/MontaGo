namespace MontagGo.API.DTOs
{
    public class CreateOrderDto
    {
        public string Name { get; set; }
        public int CustomerId { get; set; }
        public int OrderTypeId { get; set; }
        public int BillingAddressId { get; set; }
        public int DeliveryAddressId { get; set; }
        public IEnumerable<int> ProductIds { get; set; }
        public IEnumerable<int> WorkerIds { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
