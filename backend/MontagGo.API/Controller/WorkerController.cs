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
    public class WorkerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public WorkerController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
        Ok(_mapper.Map<IEnumerable<WorkerDto>>(await _context.Workers
          .Where(w => w.DeletedAt == null)
          .ToListAsync()));

        [HttpPost]
        public async Task<IActionResult> Create(WorkerDto worker)
        {
            var workerEntity = _mapper.Map<Worker>(worker);
            workerEntity.Role = await _context.Roles.FindAsync(worker.RoleId);
            _context.Workers.Add(workerEntity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = worker.Id }, worker);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WorkerDto workerDto)
        {
            if (id != workerDto.Id) return BadRequest("Worker ID mismatch.");

            var existingWorker = await _context.Workers.Include(w => w.Role).FirstOrDefaultAsync(w => w.Id == id);
            if (existingWorker == null) return NotFound("Worker not found.");

            // Map updated properties from WorkerDto to the existing Worker entity
            _mapper.Map(workerDto, existingWorker);

            // Update the Role if RoleId has changed
            if (existingWorker.RoleId != workerDto.RoleId)
            {
                var role = await _context.Roles.FindAsync(workerDto.RoleId);
                if (role == null) return BadRequest("Invalid Role ID.");
                existingWorker.Role = role;
            }

            _context.Workers.Update(existingWorker);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var worker = await _context.Workers.FindAsync(id);
            if (worker == null) return NotFound();
            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
