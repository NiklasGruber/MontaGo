namespace MontagGo.API.Mapper
{
    using AutoMapper;
    using MontagGo.API.Models;
    using MontagGo.API.DTOs;
    using MontagGo.API.DbModels;

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ...existing code...
            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
            CreateMap<OrderType, OrderTypeDto>().ReverseMap();
            CreateMap<Worker, WorkerDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Order, OrderDto>().ReverseMap();
        }
    }

}
