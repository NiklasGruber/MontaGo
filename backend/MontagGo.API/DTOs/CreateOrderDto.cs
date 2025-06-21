namespace MontagGo.API.DTOs
{
    public class CreateOrderDto
    {
        public int CustomerId { get; set; }
        public int OrderTypeId { get; set; }
        public int BillingAddressId { get; set; }
        public int DeliveryAddressId { get; set; }
        public IEnumerable<int> ProductIds { get; set; }
        public IEnumerable<int> WorkerIds { get; set; }
    }
}
