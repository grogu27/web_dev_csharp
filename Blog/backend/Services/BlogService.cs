using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BlogApp.Data;
using BlogApp.Models;
using BlogApp.DTOs.Blog;
using BlogApp.DTOs.Pagination;
using BlogApp.DTOs.User;
using BlogApp.Helpers;

namespace BlogApp.Services
{
    public class BlogService
    {
        private readonly AppDbContext _context;

        public BlogService(AppDbContext context)
        {
            _context = context;
        }

        // Получить все блоги для главной страницы (сортировка по дате)
        public async Task<PageResponse<BlogListDto>> GetAllBlogsAsync(
            PageRequest request, bool includeUnpublished = false)
        {
            var query = _context.Blogs
                .Include(b => b.Author)
                .Where(b => includeUnpublished || b.IsPublished)
                .OrderByDescending(b => b.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(b => 
                    b.Title.Contains(request.Search));
            }

            var blogs = await query
                .Select(b => new BlogListDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Excerpt = b.Content.Length > 200 
                        ? b.Content.Substring(0, 200) + "..." 
                        : b.Content,
                    CreatedAt = b.CreatedAt,
                    Author = new AuthorDto
                    {
                        Id = b.Author.Id,
                        Username = b.Author.Username,
                        Bio = b.Author.Bio
                    }
                })
                .ToPagedListAsync(request);

            return blogs;
        }

        // Получить блог по ID
        public async Task<BlogResponseDto?> GetBlogByIdAsync(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null) return null;

            return new BlogResponseDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt,
                IsPublished = blog.IsPublished,
                Author = new AuthorDto
                {
                    Id = blog.Author.Id,
                    Username = blog.Author.Username,
                    Bio = blog.Author.Bio
                }
            };
        }

        // Получить блоги автора
        public async Task<PageResponse<BlogListDto>> GetBlogsByAuthorAsync(
            int authorId, PageRequest request, ClaimsPrincipal? user = null)
        {
            var isAdmin = user?.IsInRole("Admin") ?? false;
            var userId = user?.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Blogs
                .Include(b => b.Author)
                .Where(b => b.AuthorId == authorId);

            // Пользователь видит все свои блоги, другие только опубликованные
            if (!isAdmin && (userId == null || authorId.ToString() != userId))
            {
                query = query.Where(b => b.IsPublished);
            }

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(b => 
                    b.Title.Contains(request.Search));
            }

            var blogs = await query
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BlogListDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Excerpt = b.Content.Length > 200 
                        ? b.Content.Substring(0, 200) + "..." 
                        : b.Content,
                    CreatedAt = b.CreatedAt,
                    Author = new AuthorDto
                    {
                        Id = b.Author.Id,
                        Username = b.Author.Username,
                        Bio = b.Author.Bio
                    }
                })
                .ToPagedListAsync(request);

            return blogs;
        }

        // Создать блог
        public async Task<BlogResponseDto> CreateBlogAsync(
            BlogCreateDto dto, int authorId)
        {
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                AuthorId = authorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsPublished = true
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            // Загружаем автора для DTO
            await _context.Entry(blog)
                .Reference(b => b.Author)
                .LoadAsync();

            return new BlogResponseDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt,
                IsPublished = blog.IsPublished,
                Author = new AuthorDto
                {
                    Id = blog.Author.Id,
                    Username = blog.Author.Username,
                    Bio = blog.Author.Bio
                }
            };
        }

        // Обновить блог
        public async Task<BlogResponseDto?> UpdateBlogAsync(
            int id, BlogUpdateDto dto, ClaimsPrincipal user)
        {
            var blog = await _context.Blogs
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null) return null;

            // Проверка прав
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = user.IsInRole("Admin");

            if (!isAdmin && blog.AuthorId.ToString() != userId)
                throw new UnauthorizedAccessException("Недостаточно прав");

            // Обновление полей
            if (!string.IsNullOrWhiteSpace(dto.Title))
                blog.Title = dto.Title;
            
            if (!string.IsNullOrWhiteSpace(dto.Content))
                blog.Content = dto.Content;
            
            if (dto.IsPublished.HasValue)
                blog.IsPublished = dto.IsPublished.Value;

            blog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BlogResponseDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt,
                IsPublished = blog.IsPublished,
                Author = new AuthorDto
                {
                    Id = blog.Author.Id,
                    Username = blog.Author.Username,
                    Bio = blog.Author.Bio
                }
            };
        }

        // Удалить блог
        public async Task<bool> DeleteBlogAsync(int id, ClaimsPrincipal user)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            // Проверка прав
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = user.IsInRole("Admin");

            if (!isAdmin && blog.AuthorId.ToString() != userId)
                throw new UnauthorizedAccessException("Недостаточно прав");

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return true;
        }

        // Проверить, может ли пользователь редактировать/удалять блог
        public bool CanEditBlog(Blog blog, ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = user.IsInRole("Admin");

            return isAdmin || blog.AuthorId.ToString() == userId;
        }
    }
}