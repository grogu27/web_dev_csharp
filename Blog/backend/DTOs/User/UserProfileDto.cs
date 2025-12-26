namespace BlogApp.DTOs.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
        public int BlogCount { get; set; }
    }
}