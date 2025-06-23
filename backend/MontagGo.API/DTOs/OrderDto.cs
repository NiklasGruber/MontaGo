namespace MontagGo.API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double Value { get; set; }

        public bool Active { get; set; }

        public AddressDto BillingAddress { get; set; }
        public AddressDto DeliveryAddress { get; set; }

        public int OrderTypeId { get; set; }
        public OrderTypeDto OrderType { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public List<WorkerDto> AssignedWorkers { get; set; }
    }

}
