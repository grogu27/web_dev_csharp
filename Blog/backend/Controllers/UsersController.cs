// // using BlogApp.Services;
// // using Microsoft.AspNetCore.Mvc;
// // using Swashbuckle.AspNetCore.Annotations;

// // namespace BlogApp.Controllers;

// // [ApiController]
// // [Route("api/users")]
// // [SwaggerTag("Публичные профили пользователей")]
// // public class UsersController : ControllerBase
// // {
// //     private readonly UserService _svc;
// //     public UsersController(UserService svc) => _svc = svc;

// //     /// <summary>
// //     /// Получить профиль пользователя
// //     /// </summary>
// //     [HttpGet("{id}")]
// //     [SwaggerOperation(
// //         Summary = "Профиль пользователя",
// //         Description = "Возвращает публичную информацию об авторе"
// //     )]
// //     [SwaggerResponse(StatusCodes.Status200OK, "Профиль найден")]
// //     [SwaggerResponse(StatusCodes.Status404NotFound, "Пользователь не найден")]
// //     public async Task<IActionResult> Get(int id)
// //         => Ok(await _svc.GetProfile(id));
// // }
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using BlogApp.Services;
// using BlogApp.DTOs.User;
// using BlogApp.DTOs.Pagination;
// using BlogApp.DTOs.Blog;
// using Swashbuckle.AspNetCore.Annotations;

// namespace BlogApp.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class UsersController : ControllerBase
//     {
//         private readonly UserService _userService;
//         private readonly BlogService _blogService;

//         public UsersController(UserService userService, BlogService blogService)
//         {
//             _userService = userService;
//             _blogService = blogService;
//         }

//         [AllowAnonymous]
//         [HttpGet("{id}")]
//         [SwaggerOperation(Summary = "Получить профиль автора")]
//         public async Task<IActionResult> GetAuthor(int id)
//         {
//             var author = await _userService.GetAuthorAsync(id);
//             if (author == null)
//                 return NotFound(new { message = "Автор не найден" });

//             return Ok(author);
//         }

//         [AllowAnonymous]
//         [HttpGet("{id}/blogs")]
//         [SwaggerOperation(Summary = "Получить блоги автора")]
//         public async Task<IActionResult> GetAuthorBlogs(
//             int id, [FromQuery] PageRequest request)
//         {
//             var blogs = await _blogService.GetBlogsByAuthorAsync(id, request, User);
//             return Ok(blogs);
//         }
//     }
// }

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BlogApp.Services;
using BlogApp.DTOs.User;
using BlogApp.DTOs.Pagination;
using BlogApp.DTOs.Blog;
using Swashbuckle.AspNetCore.Annotations;

namespace BlogApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [SwaggerTag("Публичные профили пользователей")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly BlogService _blogService;

        public UsersController(UserService userService, BlogService blogService)
        {
            _userService = userService;
            _blogService = blogService;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Получить профиль автора",
            Description = "Возвращает публичную информацию об авторе по его идентификатору."
        )]
        [SwaggerResponse(200, "Информация об авторе", typeof(AuthorDto))]
        [SwaggerResponse(404, "Автор не найден")]
        public async Task<IActionResult> GetAuthor(
            [SwaggerParameter("Идентификатор автора", Required = true)]
            int id)
        {
            var author = await _userService.GetAuthorAsync(id);
            if (author == null)
                return NotFound(new { message = "Автор не найден" });

            return Ok(author);
        }

        [AllowAnonymous]
        [HttpGet("{id}/blogs")]
        [SwaggerOperation(
            Summary = "Получить блоги автора",
            Description = "Возвращает пагинированный список опубликованных блогов автора " +
                         "с возможностью поиска. Показываются только опубликованные блоги."
        )]
        [SwaggerResponse(200, "Список блогов автора", typeof(PageResponse<BlogListDto>))]
        [SwaggerResponse(404, "Автор не найден")]
        public async Task<IActionResult> GetAuthorBlogs(
            [SwaggerParameter("Идентификатор автора", Required = true)]
            int id,
            [FromQuery, SwaggerParameter("Параметры пагинации и поиска", Required = false)] 
            PageRequest request)
        {
            var blogs = await _blogService.GetBlogsByAuthorAsync(id, request, User);
            return Ok(blogs);
        }

        
    }
}