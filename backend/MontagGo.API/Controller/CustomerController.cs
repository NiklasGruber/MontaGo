using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;
using MontagGo.API.DTOs;

namespace MontagGo.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CustomerController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Include(c => c.Address)
                 .Where(x => x.DeletedAt == null)// Include Address navigation property
                .Select(c => _mapper.Map<CustomerDto>(c)) // Map Customer to CustomerDto
                             .ToListAsync();

            return Ok(customers);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CustomerDto dto)
        {
            var customer = _mapper.Map<Customer>(dto); // Map CustomerDto to Customer
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, _context.Addresses.Where(x => x.Id == customer.AddressId));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, CustomerDto dto)
        {
            if (id != dto.Id) return BadRequest("Customer ID mismatch.");

            var existingCustomer = await _context.Customers.Include(c => c.Address).FirstOrDefaultAsync(c => c.Id == id);
            if (existingCustomer == null) return NotFound("Customer not found.");

            // Map updated properties from CustomerDto to the existing Customer entity
            _mapper.Map(dto, existingCustomer);

            // Update the Address if necessary
            if (existingCustomer.AddressId != dto.AddressId)
            {
                var address = await _context.Addresses.FindAsync(dto.AddressId);
                if (address == null) return BadRequest("Invalid Address ID.");
                existingCustomer.Address = address;
            }

            _context.Customers.Update(existingCustomer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound("Customer not found.");

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
