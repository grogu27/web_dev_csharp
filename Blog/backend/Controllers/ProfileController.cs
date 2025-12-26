using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BlogApp.Services;
using BlogApp.DTOs.User;
using BlogApp.DTOs.Pagination;
using BlogApp.DTOs.Blog;
using Swashbuckle.AspNetCore.Annotations;

namespace BlogApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [SwaggerTag("Управление личным профилем")]
    public class ProfileController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly BlogService _blogService;

        public ProfileController(UserService userService, BlogService blogService)
        {
            _userService = userService;
            _blogService = blogService;
        }

        [HttpGet("me")]
        [SwaggerOperation(
            Summary = "Получить свой профиль",
            Description = "Возвращает информацию о текущем авторизованном пользователе, " +
                         "включая статистику по блогам."
        )]
        [SwaggerResponse(200, "Информация о профиле", typeof(UserProfileDto))]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(404, "Пользователь не найден")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var profile = await _userService.GetProfileAsync(userId);
            if (profile == null)
                return NotFound(new { message = "Пользователь не найден" });

            return Ok(profile);
        }

        [HttpGet("me/blogs")]
        [SwaggerOperation(
            Summary = "Получить свои блоги",
            Description = "Возвращает пагинированный список блогов текущего пользователя " +
                         "с возможностью поиска. Видны все блоги, включая неопубликованные."
        )]
        [SwaggerResponse(200, "Список блогов пользователя", typeof(PageResponse<BlogListDto>))]
        [SwaggerResponse(401, "Не авторизован")]
        public async Task<IActionResult> GetMyBlogs(
            [FromQuery, SwaggerParameter("Параметры пагинации и поиска", Required = false)] 
            PageRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var blogs = await _blogService.GetBlogsByAuthorAsync(userId, request, User);
            return Ok(blogs);
        }

        [HttpPut("me")]
        [SwaggerOperation(
            Summary = "Обновить свой профиль",
            Description = "Обновляет информацию профиля текущего пользователя " +
                         "(имя пользователя, описание). Email изменять нельзя."
        )]
        [SwaggerResponse(200, "Профиль успешно обновлен", typeof(UserProfileDto))]
        [SwaggerResponse(400, "Неверные данные или имя пользователя уже используется")]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(404, "Пользователь не найден")]
        public async Task<IActionResult> UpdateMyProfile(
            [FromBody, SwaggerRequestBody("Данные для обновления профиля", Required = true)]
            UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            try
            {
                var profile = await _userService.UpdateProfileAsync(userId, dto);
                if (profile == null)
                    return NotFound(new { message = "Пользователь не найден" });

                return Ok(profile);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("me/blogs")]
        [SwaggerOperation(
            Summary = "Создать новый блог в своем профиле",
            Description = "Создает новый блог от имени текущего пользователя. " +
                         "Альтернатива созданию через общий контроллер блогов."
        )]
        [SwaggerResponse(201, "Блог успешно создан", typeof(BlogResponseDto))]
        [SwaggerResponse(400, "Неверные данные блога")]
        [SwaggerResponse(401, "Не авторизован")]
        public async Task<IActionResult> CreateMyBlog(
            [FromBody, SwaggerRequestBody("Данные для создания блога", Required = true)]
            BlogCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var blog = await _blogService.CreateBlogAsync(dto, userId);
            return Ok(blog);
        }
    }
}