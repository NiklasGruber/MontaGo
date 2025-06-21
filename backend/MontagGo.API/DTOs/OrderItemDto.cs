namespace MontagGo.API.DTOs
{
    public class OrderItemDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public ProductDto ProductName { get; set; }
        public int Quantity { get; set; }
    }

}
