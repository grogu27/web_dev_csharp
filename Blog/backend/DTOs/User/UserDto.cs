namespace BlogApp.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Role { get; set; } = "User";
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
        public int BlogCount { get; set; }
    }
}