namespace BlogApp.DTOs.User
{
    public class AuthorDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string? Bio { get; set; }
    }
}