using Microsoft.AspNetCore.Mvc;
using MarginalValera.Models;
using MarginalValera.Services;
using MarginalValera.Data;
using Swashbuckle.AspNetCore.Annotations;

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

      
        [HttpGet]
        [SwaggerOperation(Summary = "Получить всех Валер", Description = "Возвращает список всех Валер в базе данных")]
        [SwaggerResponse(200, "Список Валер успешно получен", typeof(List<Valera>))]
        public async Task<ActionResult<List<Valera>>> GetAll()
        {
            var valeras = await CreateService().GetAllValerasAsync();
            return Ok(valeras);
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Создать Валеру", Description = "Создаёт нового Валеру и возвращает его. Можно передать параметры, либо создать по умолчанию.")]
        [SwaggerResponse(200, "Валера успешно создан", typeof(Valera))]
        public async Task<ActionResult<Valera>> Create([FromBody] Valera? valera = null)
        {
            var created = await CreateService().AddValeraAsync(valera);
            return Ok(created);
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Получить Валеру по Id", Description = "Возвращает Валеру с указанным Id")]
        [SwaggerResponse(200, "Валера найден", typeof(Valera))]
        [SwaggerResponse(404, "Валера с таким Id не найден")]
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


       
        [HttpPost("{id}/{actionName}")]
        [SwaggerOperation(Summary = "Выполнить действие Валеры", Description = "Выполняет указанное действие для Валеры с заданным Id и возвращает обновлённого Валеру. (work, nature, wine, bar, marginals, sing, sleep)")]
        [SwaggerResponse(200, "Действие выполнено успешно", typeof(Valera))]
        [SwaggerResponse(400, "Ошибка при выполнении действия")]
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
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Удалить Валеру по Id", Description = "Удаляет Валеру с указанным Id из базы данных")]
        [SwaggerResponse(200, "Валера успешно удалена")]
        [SwaggerResponse(404, "Валера с таким Id не найден")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await CreateService().DeleteValeraAsync(id);
                return Ok(new { message = $"Valera #{id} успешно удален" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // [HttpPost("register")]
        // public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        // {
        //     // Проверка уникальности email
        //     if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        //     {
        //         return BadRequest(new { message = "Email уже используется" });
        //     }

        //     // Создание нового пользователя
        //     var user = new User
        //     {
        //         Email = request.Email,
        //         Username = request.Username
        //     };

        //     // Хэширование пароля
        //     user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        //     // Сохранение в базе
        //     _context.Users.Add(user);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Пользователь успешно зарегистрирован" });
        // }
    }
}
