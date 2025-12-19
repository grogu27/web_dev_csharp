using Microsoft.AspNetCore.Mvc;
using MarginalValera.Models;
using MarginalValera.Services;
using Swashbuckle.AspNetCore.Annotations;

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

        [HttpPost]
        [SwaggerOperation(
            Summary = "Создать Валеру",
            Description = "Создаёт нового Валеру. Можно передать параметры, либо создать по умолчанию"
        )]
        [SwaggerResponse(200, "Валера успешно создан", typeof(Valera))]
        public async Task<ActionResult<Valera>> Create([FromBody] Valera? valera = null)
        {
            var created = await _service.AddValeraAsync(valera);
            return Ok(created);
        }

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
                var valera = await _service.DoActionAsync(id, actionName);
                return Ok(valera);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

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
                await _service.DeleteValeraAsync(id);
                return Ok(new { message = $"Valera #{id} успешно удален" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
    }
}
