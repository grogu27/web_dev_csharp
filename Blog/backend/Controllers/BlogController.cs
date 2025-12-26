// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using System.Security.Claims;
// using BlogApp.Services;
// using BlogApp.DTOs.Blog;
// using BlogApp.DTOs.Pagination;
// using Swashbuckle.AspNetCore.Annotations;

// namespace BlogApp.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class BlogController : ControllerBase
//     {
//         private readonly BlogService _blogService;

//         public BlogController(BlogService blogService)
//         {
//             _blogService = blogService;
//         }

//         [AllowAnonymous]
//         [HttpGet]
//         [SwaggerOperation(Summary = "Получить все блоги (с пагинацией и поиском)")]
//         public async Task<IActionResult> GetAllBlogs(
//             [FromQuery] PageRequest request)
//         {
//             var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
//             var blogs = await _blogService.GetAllBlogsAsync(
//                 request, includeUnpublished: isAuthenticated);
//             return Ok(blogs);
//         }

//         [AllowAnonymous]
//         [HttpGet("{id}")]
//         [SwaggerOperation(Summary = "Получить блог по ID")]
//         public async Task<IActionResult> GetBlog(int id)
//         {
//             var blog = await _blogService.GetBlogByIdAsync(id);
//             if (blog == null)
//                 return NotFound(new { message = "Блог не найден" });

//             // Проверка прав на просмотр неопубликованных блогов
//             if (!blog.IsPublished)
//             {
//                 var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 var isAdmin = User.IsInRole("Admin");
                
//                 if (!isAdmin && (userId == null || blog.Author.Id.ToString() != userId))
//                     return NotFound(new { message = "Блог не найден" });
//             }

//             return Ok(blog);
//         }

//         [Authorize(Roles = "User,Admin")]
//         [HttpPost]
//         [SwaggerOperation(Summary = "Создать новый блог")]
//         public async Task<IActionResult> CreateBlog([FromBody] BlogCreateDto dto)
//         {
//             var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//             var blog = await _blogService.CreateBlogAsync(dto, userId);
//             return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
//         }

//         [Authorize(Roles = "User,Admin")]
//         [HttpPut("{id}")]
//         [SwaggerOperation(Summary = "Обновить блог")]
//         public async Task<IActionResult> UpdateBlog(
//             int id, [FromBody] BlogUpdateDto dto)
//         {
//             try
//             {
//                 var blog = await _blogService.UpdateBlogAsync(id, dto, User);
//                 if (blog == null)
//                     return NotFound(new { message = "Блог не найден" });

//                 return Ok(blog);
//             }
//             catch (UnauthorizedAccessException)
//             {
//                 return Forbid();
//             }
//         }

//         [Authorize(Roles = "User,Admin")]
//         [HttpDelete("{id}")]
//         [SwaggerOperation(Summary = "Удалить блог")]
//         public async Task<IActionResult> DeleteBlog(int id)
//         {
//             try
//             {
//                 var result = await _blogService.DeleteBlogAsync(id, User);
//                 if (!result)
//                     return NotFound(new { message = "Блог не найден" });

//                 return NoContent();
//             }
//             catch (UnauthorizedAccessException)
//             {
//                 return Forbid();
//             }
//         }
//     }
// }
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BlogApp.Services;
using BlogApp.DTOs.Blog;
using BlogApp.DTOs.Pagination;
using Swashbuckle.AspNetCore.Annotations;

namespace BlogApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [SwaggerTag("Управление блогами")]
    public class BlogController : ControllerBase
    {
        private readonly BlogService _blogService;

        public BlogController(BlogService blogService)
        {
            _blogService = blogService;
        }

        [AllowAnonymous]
        [HttpGet]
        [SwaggerOperation(
            Summary = "Получить все блоги",
            Description = "Возвращает пагинированный список всех блогов с возможностью поиска. " +
                         "Неавторизованные пользователи видят только опубликованные блоги. " +
                         "Авторизованные пользователи видят все блоги (включая свои неопубликованные)."
        )]
        [SwaggerResponse(200, "Список блогов", typeof(PageResponse<BlogListDto>))]
        [SwaggerResponse(400, "Неверные параметры пагинации")]
        public async Task<IActionResult> GetAllBlogs(
            [FromQuery, SwaggerParameter("Параметры пагинации и поиска", Required = false)] 
            PageRequest request)
        {
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            var blogs = await _blogService.GetAllBlogsAsync(
                request, includeUnpublished: isAuthenticated);
            return Ok(blogs);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Получить блог по ID",
            Description = "Возвращает полную информацию о блоге по его идентификатору. " +
                         "Неопубликованные блоги видны только автору и администраторам."
        )]
        [SwaggerResponse(200, "Информация о блоге", typeof(BlogResponseDto))]
        [SwaggerResponse(404, "Блог не найден или нет прав на просмотр")]
        public async Task<IActionResult> GetBlog(
            [SwaggerParameter("Идентификатор блога", Required = true)]
            int id)
        {
            var blog = await _blogService.GetBlogByIdAsync(id);
            if (blog == null)
                return NotFound(new { message = "Блог не найден" });

            // Проверка прав на просмотр неопубликованных блогов
            if (!blog.IsPublished)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var isAdmin = User.IsInRole("Admin");
                
                if (!isAdmin && (userId == null || blog.Author.Id.ToString() != userId))
                    return NotFound(new { message = "Блог не найден" });
            }

            return Ok(blog);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        [SwaggerOperation(
            Summary = "Создать новый блог",
            Description = "Создает новый блог от имени текущего авторизованного пользователя. " +
                         "Блог автоматически становится опубликованным."
        )]
        [SwaggerResponse(201, "Блог успешно создан", typeof(BlogResponseDto))]
        [SwaggerResponse(400, "Неверные данные блога")]
        [SwaggerResponse(401, "Не авторизован")]
        public async Task<IActionResult> CreateBlog(
            [FromBody, SwaggerRequestBody("Данные для создания блога", Required = true)]
            BlogCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var blog = await _blogService.CreateBlogAsync(dto, userId);
            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Обновить блог",
            Description = "Обновляет существующий блог. " +
                         "Пользователи могут обновлять только свои блоги. " +
                         "Администраторы могут обновлять любые блоги."
        )]
        [SwaggerResponse(200, "Блог успешно обновлен", typeof(BlogResponseDto))]
        [SwaggerResponse(400, "Неверные данные для обновления")]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(403, "Нет прав на обновление этого блога")]
        [SwaggerResponse(404, "Блог не найден")]
        public async Task<IActionResult> UpdateBlog(
            [SwaggerParameter("Идентификатор блога", Required = true)]
            int id,
            [FromBody, SwaggerRequestBody("Данные для обновления блога", Required = true)]
            BlogUpdateDto dto)
        {
            try
            {
                var blog = await _blogService.UpdateBlogAsync(id, dto, User);
                if (blog == null)
                    return NotFound(new { message = "Блог не найден" });

                return Ok(blog);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Удалить блог",
            Description = "Удаляет блог по идентификатору. " +
                         "Пользователи могут удалять только свои блоги. " +
                         "Администраторы могут удалять любые блоги."
        )]
        [SwaggerResponse(204, "Блог успешно удален")]
        [SwaggerResponse(401, "Не авторизован")]
        [SwaggerResponse(403, "Нет прав на удаление этого блога")]
        [SwaggerResponse(404, "Блог не найден")]
        public async Task<IActionResult> DeleteBlog(
            [SwaggerParameter("Идентификатор блога", Required = true)]
            int id)
        {
            try
            {
                var result = await _blogService.DeleteBlogAsync(id, User);
                if (!result)
                    return NotFound(new { message = "Блог не найден" });

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // [Authorize(Roles = "Admin")]
        // [HttpPatch("{id}/publish")]
        // [SwaggerOperation(
        //     Summary = "Изменить статус публикации блога",
        //     Description = "Изменяет статус публикации блога (опубликован/не опубликован). " +
        //                  "Только для администраторов."
        // )]
        // [SwaggerResponse(200, "Статус публикации изменен")]
        // [SwaggerResponse(401, "Не авторизован")]
        // [SwaggerResponse(403, "Нет прав администратора")]
        // [SwaggerResponse(404, "Блог не найден")]
        // public async Task<IActionResult> TogglePublishStatus(
        //     [SwaggerParameter("Идентификатор блога", Required = true)]
        //     int id,
        //     [FromBody, SwaggerRequestBody("Новый статус публикации", Required = true)]
        //     bool isPublished)
        // {
        //     return Ok(new { message = $"Статус публикации блога {id} изменен на {isPublished}" });
        // }
    }
}