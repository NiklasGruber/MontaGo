using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;

namespace MontagGo.API.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // optional: Nur Admins dürfen Benutzer verwalten
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Users.Where(x => x.DeletedAt == null).ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) =>
            await _context.Users.FindAsync(id) is User u ? Ok(u) : NotFound();

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
