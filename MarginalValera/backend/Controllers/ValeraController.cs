using Microsoft.AspNetCore.Mvc;
using MarginalValera.Models;
using MarginalValera.Services;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MarginalValera.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValeraController : ControllerBase
    {
        private readonly ValeraService _service;

        public ValeraController(ValeraService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [SwaggerOperation(
            Summary = "Получить всех Валер",
            Description = "Возвращает список всех Валер в базе данных"
        )]
        [SwaggerResponse(200, "Список Валер успешно получен", typeof(List<Valera>))]
        public async Task<ActionResult<List<Valera>>> GetAll()
        {
            var valeras = await _service.GetAllValerasAsync();
            return Ok(valeras);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("my")]
        [SwaggerOperation(
            Summary = "Получить только свои Валеры",
            Description = "Возвращает список Валер, принадлежащих текущему авторизованному пользователю"
        )]
        [SwaggerResponse(200, "Список Валер успешно получен", typeof(List<Valera>))]
        [SwaggerResponse(401, "Пользователь не авторизован")]
        public async Task<ActionResult<List<Valera>>> GetMyValeras()
        {
            var valeras = await _service.GetMyValerasAsync(User);
            return Ok(valeras);
        }


        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        [SwaggerOperation(
            Summary = "Создать Валеру",
            Description = "Создаёт нового Валеру. Можно передать параметры, либо создать по умолчанию"
        )]
        [SwaggerResponse(200, "Валера успешно создан", typeof(Valera))]
        public async Task<ActionResult<Valera>> Create([FromBody] Valera? valera = null)
        {
            //int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("UserId not found in token");

            int userId = int.Parse(userIdClaim);
            var created = await _service.AddValeraAsync(valera, userId);
            return Ok(created);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Получить Валеру по Id",
            Description = "Возвращает Валеру с указанным Id"
        )]
        [SwaggerResponse(200, "Валера найден", typeof(Valera))]
        [SwaggerResponse(404, "Валера с таким Id не найден")]
        public async Task<ActionResult<Valera>> GetById(int id)
        {
            try
            {
                var valera = await _service.GetValeraAsync(id);
                return Ok(valera);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost("{id}/{actionName}")]
        [SwaggerOperation(
            Summary = "Выполнить действие Валеры",
            Description = "Выполняет указанное действие для Валеры с заданным Id (work, nature, wine, bar, marginals, sing, sleep)"
        )]
        [SwaggerResponse(200, "Действие выполнено успешно", typeof(Valera))]
        [SwaggerResponse(400, "Ошибка при выполнении действия")]
        public async Task<ActionResult<Valera>> DoAction(int id, string actionName)
        {
            try
            {
                var valera = await _service.DoActionAsync(id, actionName, User);
                return Ok(valera);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Удалить Валеру по Id",
            Description = "Удаляет Валеру с указанным Id из базы данных"
        )]
        [SwaggerResponse(200, "Валера успешно удалена")]
        [SwaggerResponse(404, "Валера с таким Id не найден")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteValeraAsync(id, User);
                return Ok(new { message = $"Valera #{id} успешно удален" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
    }
}
