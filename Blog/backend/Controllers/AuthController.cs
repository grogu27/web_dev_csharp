using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BlogApp.Services;
using BlogApp.DTOs.Auth;
using BlogApp.DTOs.User;
using Swashbuckle.AspNetCore.Annotations;

namespace BlogApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [SwaggerTag("Аутентификация и регистрация пользователей")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [SwaggerOperation(
            Summary = "Регистрация нового пользователя",
            Description = "Создает нового пользователя в системе. Возвращает информацию о пользователе БЕЗ токена."
        )]
        [SwaggerResponse(200, "Успешная регистрация", typeof(RegisterResponse))]
        [SwaggerResponse(400, "Неверные данные или email/username уже используются")]
        [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [SwaggerOperation(
            Summary = "Вход пользователя",
            Description = "Аутентификация пользователя по email и паролю. Возвращает JWT токен и информацию о пользователе."
        )]
        [SwaggerResponse(200, "Успешный вход", typeof(AuthResponse))]
        [SwaggerResponse(401, "Неверный email или пароль")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        [SwaggerOperation(
            Summary = "Получить информацию о текущем пользователе",
            Description = "Возвращает информацию о текущем авторизованном пользователе на основе JWT токена."
        )]
        [SwaggerResponse(200, "Информация о пользователе", typeof(UserDto))]
        [SwaggerResponse(401, "Не авторизован")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (userId == null)
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(int.Parse(userId));
            
            if (user == null)
                return NotFound(new { message = "Пользователь не найден" });

            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        [SwaggerOperation(
            Summary = "Получить всех пользователей",
            Description = "Возвращает список всех пользователей с их блогами. Только для администраторов."
        )]
        [SwaggerResponse(200, "Список пользователей", typeof(List<UserDto>))]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(403, "Нет прав администратора")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _authService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("users/{id}")]
        [SwaggerOperation(
            Summary = "Удалить пользователя",
            Description = "Удаляет пользователя по ID. " +
                         "Пользователи могут удалить только свой аккаунт. " +
                         "Администраторы могут удалить любой аккаунт, кроме последнего администратора."
        )]
        [SwaggerResponse(200, "Пользователь успешно удален")]
        [SwaggerResponse(400, "Нельзя удалить последнего администратора")]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(403, "Недостаточно прав для удаления этого пользователя")]
        [SwaggerResponse(404, "Пользователь не найден")]
        public async Task<IActionResult> DeleteUser(
            [SwaggerParameter("ID пользователя для удаления", Required = true)]
            int id)
        {
            try
            {
                var result = await _authService.DeleteUserAsync(id, User);
                
                if (result)
                    return Ok(new { message = $"Пользователь с ID {id} успешно удален" });
                
                return NotFound(new { message = "Пользователь не найден" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("me")]
        [SwaggerOperation(
            Summary = "Удалить свой аккаунт",
            Description = "Удаляет аккаунт текущего пользователя. Все блоги пользователя также будут удалены."
        )]
        [SwaggerResponse(200, "Аккаунт успешно удален")]
        [SwaggerResponse(400, "Нельзя удалить последнего администратора")]
        [SwaggerResponse(401, "Не авторизован")]
        public async Task<IActionResult> DeleteMyAccount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (userId == null)
                    return Unauthorized();

                var result = await _authService.DeleteUserAsync(int.Parse(userId), User);
                
                if (result)
                    return Ok(new { message = "Ваш аккаунт успешно удален" });
                
                return NotFound(new { message = "Пользователь не найден" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users/{id}")]
        [SwaggerOperation(
            Summary = "Получить пользователя по ID",
            Description = "Возвращает информацию о пользователе по его ID. Только для администраторов."
        )]
        [SwaggerResponse(200, "Информация о пользователе", typeof(UserDto))]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(403, "Нет прав администратора")]
        [SwaggerResponse(404, "Пользователь не найден")]
        public async Task<IActionResult> GetUserById(
            [SwaggerParameter("ID пользователя", Required = true)]
            int id)
        {
            try
            {
                var user = await _authService.GetUserByIdAsync(id);
                
                if (user == null)
                    return NotFound(new { message = "Пользователь не найден" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [AllowAnonymous]  
        [HttpPost("create-admin")]
        [SwaggerOperation(
            Summary = "Создать администратора",
            Description = "Создает нового пользователя с ролью Admin."
        )]
        [SwaggerResponse(200, "Администратор создан", typeof(RegisterResponse))]
        [SwaggerResponse(400, "Неверные данные или email/username уже используются")]
        public async Task<IActionResult> CreateAdmin([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.CreateAdminAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}