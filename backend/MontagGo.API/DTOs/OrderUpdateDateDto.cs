namespace MontagGo.API.DTOs
{
    public class OrderUpdateDateDto
    {
        public int Id { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
