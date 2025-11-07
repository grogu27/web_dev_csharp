using Microsoft.EntityFrameworkCore;
using MarginalValera.Models;

namespace MarginalValera.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<Valera> Valeras { get; set; } = null!;
    }
}
