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
    public class OrderTypeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderTypeController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var types = await _context.OrderTypes.Where(x => x.DeletedAt == null).ToListAsync();
            var typeDtos = _mapper.Map<List<OrderTypeDto>>(types);
            return Ok(typeDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderTypeDto typeDto)
        {
            var type = _mapper.Map<OrderType>(typeDto);
            _context.OrderTypes.Add(type);
            await _context.SaveChangesAsync();
            var createdDto = _mapper.Map<OrderTypeDto>(type);
            return CreatedAtAction(nameof(GetAll), new { id = type.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderTypeDto typeDto)
        {
            var type = await _context.OrderTypes.FindAsync(id);
            if (type == null) return NotFound();

            _mapper.Map(typeDto, type);
            _context.Entry(type).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/color")]
        public async Task<IActionResult> UpdateColor(int id, [FromBody] string color)
        {
            var type = await _context.OrderTypes.FindAsync(id);
            if (type == null) return NotFound();
            type.ColorHex = color; // Assuming OrderType has a Color property
            _context.Entry(type).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var type = await _context.OrderTypes.FindAsync(id);
            if (type == null) return NotFound();
            _context.OrderTypes.Remove(type);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
