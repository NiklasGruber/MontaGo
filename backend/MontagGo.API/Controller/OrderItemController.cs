using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;
using MontagGo.API.DTOs;

namespace MontagGo.API.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderItemController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderItemController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/OrderItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetOrderItems()
        {
            var orderItems = await _context.OrderItems.Where(x => x.DeletedAt == null).ToListAsync();
            return Ok(_mapper.Map<IEnumerable<OrderItemDto>>(orderItems));
        }

        // GET: api/OrderItem/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDto>> GetOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null) return NotFound("OrderItem not found.");

            return Ok(_mapper.Map<OrderItemDto>(orderItem));
        }

        // POST: api/OrderItem
        [HttpPost]
        public async Task<ActionResult<OrderItemDto>> CreateOrderItem([FromBody] OrderItemDto orderItemDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var orderItem = _mapper.Map<OrderItem>(orderItemDto);
            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderItem), new { id = orderItem.Id }, _mapper.Map<OrderItemDto>(orderItem));
        }

        // PUT: api/OrderItem/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderItem(int id, [FromBody] OrderItemDto orderItemDto)
        {
            if (id != orderItemDto.Id) return BadRequest("OrderItem ID mismatch.");

            var existingOrderItem = await _context.OrderItems.FindAsync(id);
            if (existingOrderItem == null) return NotFound("OrderItem not found.");

            _mapper.Map(orderItemDto, existingOrderItem);
            _context.OrderItems.Update(existingOrderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/OrderItem/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null) return NotFound("OrderItem not found.");

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

