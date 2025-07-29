using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class Project
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(300)]
    public string? ProjectUrl { get; set; }

    [StringLength(300)]
    public string? GithubUrl { get; set; }

    public string? Technologies { get; set; } // JSON array of strings

    public string? ImageUrls { get; set; } // JSON array of up to 3 image URLs

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}
