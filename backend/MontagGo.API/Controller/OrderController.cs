using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;
using MontagGo.API.DTOs;
using AutoMapper;

namespace MontagGo.API.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrdersController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders.ToListAsync();

            // Manuelles Mapping der abhängigen Entitäten für das DTO
            var orderDtos = new List<OrderDto>();
            foreach (var order in orders)
            {
                if (order.IsDeleted)
                    continue;

                var dto = _mapper.Map<OrderDto>(order);

                // BillingAddress
                dto.BillingAddress = _mapper.Map<AddressDto>(
                    await _context.Addresses.FindAsync(order.BillingAddressId));

                // DeliveryAddress
                dto.DeliveryAddress = _mapper.Map<AddressDto>(
                    await _context.Addresses.FindAsync(order.DeliveryAddressId));

                // OrderType
                dto.OrderType = _mapper.Map<OrderTypeDto>(
                    await _context.OrderTypes.FindAsync(order.OrderTypeId));

                dto.OrderTypeId = order.OrderTypeId;

                // Items
                dto.Items = await _context.OrderItems
                    .Where(oi => oi.OrderId == order.Id)
                    .Select(oi => _mapper.Map<OrderItemDto>(oi))
                    .ToListAsync();

                // AssignedWorkers
                dto.AssignedWorkers = await _context.Workers
                    .Where(w => order.AssignedWorkers.Contains(w.Id))
                    .Select(w => _mapper.Map<WorkerDto>(w))
                    .ToListAsync();

                dto.StartDate = order.StartDate == DateTime.MinValue ? null : order.StartDate;
                dto.DueDate = order.DueDate == DateTime.MinValue ? null : order.DueDate;
                dto.EndDate = order.EndDate == DateTime.MinValue ? null : order.EndDate;

                dto.Active = order.DueDate != DateTime.MinValue && order.StartDate != DateTime.MinValue && order.DueDate > DateTime.UtcNow || order.EndDate < DateTime.UtcNow && order.EndDate != DateTime.MinValue;

                orderDtos.Add(dto);
            }

            return Ok(orderDtos);
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();

            var dto = _mapper.Map<OrderDto>(order);

            dto.BillingAddress = _mapper.Map<AddressDto>(
                await _context.Addresses.FindAsync(order.BillingAddressId));
            dto.DeliveryAddress = _mapper.Map<AddressDto>(
                await _context.Addresses.FindAsync(order.DeliveryAddressId));
            dto.OrderType = _mapper.Map<OrderTypeDto>(
                await _context.OrderTypes.FindAsync(order.OrderTypeId));
            dto.Items = await _context.OrderItems
                .Where(oi => oi.OrderId == order.Id)
                .Select(oi => _mapper.Map<OrderItemDto>(oi))
                .ToListAsync();
            dto.AssignedWorkers = await _context.Workers
                .Where(w => order.AssignedWorkers.Contains(w.Id))
                .Select(w => _mapper.Map<WorkerDto>(w))
                .ToListAsync();

            return Ok(dto);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = _mapper.Map<Order>(orderDto);

            // Items und AssignedWorkers müssen ggf. separat behandelt werden
            // Beispiel: Items
            if (orderDto.ProductIds != null)
            {
                foreach (var productId in orderDto.ProductIds)
                {
                    var item = new OrderItem
                    {
                        ProductId = productId,
                        OrderId = order.Id,
                        Quantity = 1 // oder aus DTO, falls vorhanden
                    };
                    _context.OrderItems.Add(item);
                }
            }

            // Beispiel: AssignedWorkers
            if (orderDto.WorkerIds != null)
            {
                order.AssignedWorkers = orderDto.WorkerIds.ToList();
            }

            //CheckDates
            order.StartDate = (orderDto.StartDate ?? DateTime.MinValue).ToUniversalTime();
            order.DueDate = (orderDto.DueDate ?? DateTime.MinValue).ToUniversalTime();
            order.EndDate = (orderDto.EndDate ?? DateTime.MinValue).ToUniversalTime();

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<CreateOrderDto>(order);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, createdDto);
        }

        [HttpPut("{id}/dates")]
        public async Task<IActionResult> UpdateDate(int id, OrderUpdateDateDto updateDateDto)
        {
            if (id != updateDateDto.Id) return BadRequest("Order ID mismatch.");
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Order not found.");
            // Update the dates
            order.StartDate = updateDateDto.StartDate ?? order.StartDate;
            order.DueDate = updateDateDto.DueDate ?? order.DueDate;
            order.EndDate = updateDateDto.EndDate ?? order.EndDate;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Order not found.");

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDto orderDto)
        {
            if (id != orderDto.Id) return BadRequest("Order ID mismatch.");

            var existingOrder = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (existingOrder == null) return NotFound("Order not found.");

            try
            {
                _mapper.Map(orderDto, existingOrder);
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }

            // Items und AssignedWorkers ggf. aktualisieren
            // Beispiel: Items
            var existingItems = await _context.OrderItems.Where(oi => oi.OrderId == id).ToListAsync();
            _context.OrderItems.RemoveRange(existingItems);
            if (orderDto.Items != null)
            {
                foreach (var itemDto in orderDto.Items)
                {
                    var item = _mapper.Map<OrderItem>(itemDto);
                    item.OrderId = id;
                    _context.OrderItems.Add(item);
                }
            }

            // Beispiel: AssignedWorkers
            if (orderDto.AssignedWorkers != null)
            {
                existingOrder.AssignedWorkers = orderDto.AssignedWorkers.Select(w => w.Id).ToList();
            }

            _context.Orders.Update(existingOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
