using BlogApp.DTOs.User;

namespace BlogApp.DTOs.Blog
{
    public class BlogResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public AuthorDto Author { get; set; } = null!;
        public bool IsPublished { get; set; }
    }
}