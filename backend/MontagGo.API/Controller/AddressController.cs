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
    public class AddressController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AddressController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var addresses = await _context.Addresses.ToListAsync();
            var addressDtos = _mapper.Map<List<AddressDto>>(addresses);
            return Ok(addressDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();
            var addressDto = _mapper.Map<AddressDto>(address);
            return Ok(addressDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddressDto addressDto)
        {
            var address = _mapper.Map<Address>(addressDto);
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            var createdDto = _mapper.Map<AddressDto>(address);
            return CreatedAtAction(nameof(Get), new { id = address.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AddressDto addressDto)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();

            _mapper.Map(addressDto, address);
            _context.Entry(address).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
