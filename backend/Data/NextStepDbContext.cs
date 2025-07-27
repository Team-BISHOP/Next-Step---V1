using Microsoft.EntityFrameworkCore;
using NextStepBackend.Models;

namespace NextStepBackend.Data;

public class NextStepDbContext : DbContext
{
    public NextStepDbContext(DbContextOptions<NextStepDbContext> options) : base(options) { }

    // Core auth tables
    public DbSet<User> Users { get; set; }
    public DbSet<Profile> Profiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<Profile>(p => p.UserId);
    }
}