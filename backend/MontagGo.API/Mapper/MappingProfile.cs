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
            CreateMap<Customer, CustomerDto>().ReverseMap();
            CreateMap<Role, RoleDto>().ReverseMap();
            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<Order, CreateOrderDto>().ReverseMap();

            CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.AssignedWorkers, opt => opt.Ignore())
            .ReverseMap();
        }
    }

}
