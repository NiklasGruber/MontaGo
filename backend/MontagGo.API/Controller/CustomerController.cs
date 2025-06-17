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

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Select(c => new CustomerDto { CompanyName = c.CompanyName, Address = c.Address })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CustomerDto dto)
        {
            var customer = new Customer { CompanyName = dto.CompanyName, Address = dto.Address };
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, dto);
        }
    }

    // Migration would be generated using EF Core CLI:
    // dotnet ef migrations add AddCustomerTable
    // dotnet ef database update
}

