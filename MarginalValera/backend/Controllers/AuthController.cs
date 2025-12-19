// using Microsoft.AspNetCore.Mvc;
// using MarginalValera.Services;
// using MarginalValera.DTOs;
// using Swashbuckle.AspNetCore.Annotations;

// namespace MarginalValera.Controllers
// {
//     [ApiController]
//     [Route("api/auth")]
//     public class AuthController : ControllerBase
//     {
//         private readonly ValeraService _service;

//         public AuthController(ValeraService service)
//         {
//             _service = service;
//         }

//         [HttpPost("register")]
//         [SwaggerOperation(Summary = "Регистрация пользователя")]
//         public async Task<IActionResult> Register(RegisterRequest request)
//         {
//             var user = await _service.RegisterUserAsync(request);
//             return Ok(new { user.Id, user.Email });
//         }

//         [HttpPost("login")]
//         [SwaggerOperation(Summary = "Вход пользователя")]
//         [SwaggerResponse(200, "JWT токен")]
//         [SwaggerResponse(401, "Неверные данные")]
//         public async Task<IActionResult> Login(LoginRequest request)
//         {
//             try
//             {
//                 var result = await _service.LoginAsync(request);
//                 return Ok(result);
//             }
//             catch (UnauthorizedAccessException ex)
//             {
//                 return Unauthorized(new { message = ex.Message });
//             }
//         }

//         [HttpGet("users")]
//         public async Task<IActionResult> GetUsers()
//         {
//             return Ok(await _service.GetAllUsersAsync());
//         }

//         [HttpDelete("users/{id}")]
//         public async Task<IActionResult> DeleteUser(int id)
//         {
//             await _service.DeleteUserAsync(id);
//             return Ok();
//         }
//     }
// }
using Microsoft.AspNetCore.Mvc;
using MarginalValera.Services;
using MarginalValera.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;

namespace MarginalValera.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [SwaggerOperation(Summary = "Регистрация нового пользователя")]
        [SwaggerResponse(200, "Пользователь успешно зарегистрирован")]
        [SwaggerResponse(400, "Email уже используется")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _authService.RegisterUserAsync(request);
                return Ok(new { message = "Пользователь успешно зарегистрирован", userId = user.Id });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [SwaggerOperation(Summary = "Вход пользователя и получение JWT")]
        [SwaggerResponse(200, "JWT токен")]
        [SwaggerResponse(401, "Неверный email или пароль")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.LoginAsync(request.Email, request.Password, request.Username);
                return Ok(new { token });
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        [SwaggerOperation(Summary = "Получить всех пользователей")]
        [SwaggerResponse(200, "Список пользователей успешно получен")]
        [SwaggerResponse(404, "Пользователь с таким Id не найден")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("users/{id}")]
        [SwaggerOperation(Summary = "Удалить пользователя по Id")]
        [SwaggerResponse(200, "Пользователь успешно удален")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _authService.DeleteUserAsync(id);
                return Ok(new { message = $"Пользователь #{id} успешно удален" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
