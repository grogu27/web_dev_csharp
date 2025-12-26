namespace BlogApp.DTOs.Blog
{
    public class BlogUpdateDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public bool? IsPublished { get; set; }
    }
}