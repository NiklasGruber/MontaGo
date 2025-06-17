using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.DbModels;
using MontagGo.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MontagGo.API.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RoleController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Role
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<RoleDto>>(roles));
        }

        // GET: api/Role/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> GetRoleById(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<RoleDto>(role));
        }

        // POST: api/Role
        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole([FromBody] RoleDto roleDto)
        {
            if (roleDto == null || string.IsNullOrEmpty(roleDto.Name))
            {
                return BadRequest("Invalid role data.");
            }

            var role = _mapper.Map<Role>(roleDto);
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoleById), new { id = role.Id }, _mapper.Map<RoleDto>(role));
        }

        // PUT: api/Role/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRole(int id, [FromBody] RoleDto roleDto)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            if (roleDto == null || string.IsNullOrEmpty(roleDto.Name))
            {
                return BadRequest("Invalid role data.");
            }

            role.Name = roleDto.Name;
            _context.Roles.Update(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Role/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
