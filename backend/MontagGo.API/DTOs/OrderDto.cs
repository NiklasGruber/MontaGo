namespace MontagGo.API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime CreatedAt { get; set; }

        public AddressDto BillingAddress { get; set; }
        public AddressDto DeliveryAddress { get; set; }

        public OrderTypeDto OrderType { get; set; }
        public List<OrderItemDto> Items { get; set; }

        public List<WorkerDto> AssignedWorkers { get; set; }
    }

}
