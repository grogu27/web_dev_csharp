using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BlogApp.Data;
using BlogApp.Models;
using BlogApp.DTOs.User;

namespace BlogApp.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        // Получить профиль пользователя
        public async Task<UserProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Blogs)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt,
                BlogCount = user.Blogs.Count(b => b.IsPublished)
            };
        }

        // Получить профиль автора
        public async Task<AuthorDto?> GetAuthorAsync(int authorId)
        {
            var user = await _context.Users.FindAsync(authorId);
            
            if (user == null) return null;

            return new AuthorDto
            {
                Id = user.Id,
                Username = user.Username,
                Bio = user.Bio
            };
        }

        // Обновить профиль
        public async Task<UserProfileDto?> UpdateProfileAsync(
            int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.Username))
            {
                // Проверка уникальности имени пользователя
                if (await _context.Users
                    .AnyAsync(u => u.Username == dto.Username && u.Id != userId))
                    throw new InvalidOperationException("Имя пользователя уже используется");
                
                user.Username = dto.Username;
            }

            if (dto.Bio != null)
                user.Bio = dto.Bio;

            await _context.SaveChangesAsync();

            return await GetProfileAsync(userId);
        }


    }
}