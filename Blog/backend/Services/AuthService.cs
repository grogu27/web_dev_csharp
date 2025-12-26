using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BlogApp.Data;
using BlogApp.Models;
using BlogApp.DTOs.Auth;
using BlogApp.Helpers;
using BlogApp.DTOs.User;

namespace BlogApp.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _jwtHelper = jwtHelper;
        }

        // Регистрация
        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email уже используется");

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                throw new InvalidOperationException("Имя пользователя уже используется");

            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new RegisterResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Message = "Регистрация успешна"
            };
        }

        // Вход
        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                throw new InvalidOperationException("Неверный email или пароль");

            var result = _passwordHasher.VerifyHashedPassword(
                user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                throw new InvalidOperationException("Неверный email или пароль");

            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role
            };
        }

        // Получить всех пользователей (только для админов)
        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username = u.Username,
                    Role = u.Role,
                    Bio = u.Bio,
                    CreatedAt = u.CreatedAt,
                    BlogCount = u.Blogs.Count(b => b.IsPublished)
                })
                .OrderBy(u => u.Id)
                .ToListAsync();
        }

        // Удалить пользователя
        public async Task<bool> DeleteUserAsync(int userId, ClaimsPrincipal currentUser)
        {
            var userToDelete = await _context.Users
                .Include(u => u.Blogs)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (userToDelete == null)
                throw new ArgumentException($"Пользователь с id {userId} не найден");

            // Проверка прав
            var currentUserId = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = currentUser.IsInRole("Admin");

            // Пользователь может удалить только себя, админ - любого
            if (!isAdmin && userToDelete.Id.ToString() != currentUserId)
                throw new UnauthorizedAccessException("Вы можете удалить только свой аккаунт");

            // Не позволяем удалить последнего админа
            if (userToDelete.Role == "Admin")
            {
                var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
                if (adminCount <= 1)
                    throw new InvalidOperationException("Нельзя удалить последнего администратора");
            }

            // Удаляем все блоги пользователя
            _context.Blogs.RemoveRange(userToDelete.Blogs);
            
            // Удаляем пользователя
            _context.Users.Remove(userToDelete);
            
            await _context.SaveChangesAsync();
            return true;
        }

        // Получить пользователя по ID
        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username = u.Username,
                    Role = u.Role,
                    Bio = u.Bio,
                    CreatedAt = u.CreatedAt,
                    BlogCount = u.Blogs.Count(b => b.IsPublished)
                })
                .FirstOrDefaultAsync();
        }
        public async Task<RegisterResponse> CreateAdminAsync(RegisterRequest request)
{
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email уже используется");

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            throw new InvalidOperationException("Имя пользователя уже используется");

        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            Role = "Admin", 
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new RegisterResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Username = user.Username,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            Message = "Администратор успешно создан"
        };
    }
    }
}