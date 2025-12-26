namespace BlogApp.DTOs.Auth
{
    public class RegisterResponse
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
        public string Message { get; set; } = "Регистрация успешна";
    }
}