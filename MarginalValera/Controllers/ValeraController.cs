using Microsoft.AspNetCore.Mvc;
using MarginalValera.Models;
using MarginalValera.Services;
using MarginalValera.Data;
using Microsoft.EntityFrameworkCore;

namespace MarginalValera.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValeraController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ValeraController(AppDbContext context)
        {
            _context = context;
        }

        private ValeraService CreateService() => new ValeraService(_context);

        // GET /api/valera
        [HttpGet]
        public async Task<ActionResult<List<Valera>>> GetAll()
        {
            var valeras = await CreateService().GetAllValerasAsync();
            return Ok(valeras);
        }

        // POST /api/valera
        [HttpPost]
        public async Task<ActionResult<Valera>> Create()
        {
            var valera = await CreateService().AddValeraAsync();
            return Ok(valera);
        }

        // GET /api/valera/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Valera>> GetById(int id)
        {
            try
            {
                var valera = await CreateService().GetValeraAsync(id);
                return Ok(valera);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // POST /api/valera/{id}/{actionName}
        [HttpPost("{id}/{actionName}")]
        public async Task<ActionResult<Valera>> DoAction(int id, string actionName)
        {
            try
            {
                await CreateService().DoActionAsync(id, actionName);
                var valera = await CreateService().GetValeraAsync(id);
                return Ok(valera);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}