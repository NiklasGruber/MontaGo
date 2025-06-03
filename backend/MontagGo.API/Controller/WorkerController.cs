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
            Ok(await _context.Workers.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create(WorkerDto worker)
        {
            _context.Workers.Add(_mapper.Map<Worker>(worker));
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = worker.Id }, worker);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WorkerDto worker)
        {
            if (id != worker.Id) return BadRequest();
            _context.Entry(worker).State = EntityState.Modified;
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
