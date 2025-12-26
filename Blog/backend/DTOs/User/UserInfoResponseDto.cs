namespace BlogApp.DTOs.User
{
    public class UserInfoResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Role { get; set; } = "User";
    }
}