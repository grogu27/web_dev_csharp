using BlogApp.DTOs.User;

namespace BlogApp.DTOs.Blog
{
    public class BlogListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Excerpt { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public AuthorDto Author { get; set; } = null!;
    }
}