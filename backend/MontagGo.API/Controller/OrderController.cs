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
    [Authorize] // 🔐 Schützt alle Endpunkte mit JWT
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
            var orders = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.BillingAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.OrderType)
                .Include(o => o.AssignedWorkers)
                .ToListAsync();

            var orderDtos = _mapper.Map<List<OrderDto>>(orders);
            return Ok(orderDtos);
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.BillingAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.OrderType)
                .Include(o => o.AssignedWorkers)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            var orderDto = _mapper.Map<OrderDto>(order);
            return Ok(orderDto);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = _mapper.Map<Order>(orderDto);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<OrderDto>(order);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, createdDto);
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

            var existingOrder = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.BillingAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.OrderType)
                .Include(o => o.AssignedWorkers)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null) return NotFound("Order not found.");

            // Map updated properties from OrderDto to the existing Order entity
            _mapper.Map(orderDto, existingOrder);

            // Update related entities if necessary
            if (orderDto.BillingAddress != null)
            {
                existingOrder.BillingAddress = _mapper.Map<Address>(orderDto.BillingAddress);
            }

            if (orderDto.DeliveryAddress != null)
            {
                existingOrder.DeliveryAddress = _mapper.Map<Address>(orderDto.DeliveryAddress);
            }

            if (orderDto.OrderType != null)
            {
                var orderType = await _context.OrderTypes.FindAsync(orderDto.OrderType.Id);
                if (orderType == null) return BadRequest("Invalid OrderType ID.");
                existingOrder.OrderType = orderType;
            }

            if (orderDto.AssignedWorkers != null)
            {
                var workers = await _context.Workers
                    .Where(w => orderDto.AssignedWorkers.Select(aw => aw.Id).Contains(w.Id))
                    .ToListAsync();
                existingOrder.AssignedWorkers = workers;
            }

            _context.Orders.Update(existingOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
