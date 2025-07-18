﻿namespace MontagGo.API.DbModels
{
    public class OrderItem : TrackableEntity
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public int OrderId { get; set; }
    }
}