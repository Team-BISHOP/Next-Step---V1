using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class Profile
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [StringLength(200)]
    public string? AvatarUrl { get; set; }

    [StringLength(100)]
    public string? University { get; set; }

    public int? YearOfStudy { get; set; }

    [StringLength(100)]
    public string? Major { get; set; }

    public string? Skills { get; set; } // JSON array of strings

    public string? CareerInterests { get; set; } // JSON array of strings

    [StringLength(50)]
    public string? GithubUsername { get; set; }

    [StringLength(200)]
    public string? LinkedinUrl { get; set; }

    [StringLength(200)]
    public string? PortfolioUrl { get; set; }

    public int Points { get; set; } = 0;

    public int Level { get; set; } = 1;

    // Industry expert specific fields
    [StringLength(100)]
    public string? Company { get; set; }

    [StringLength(100)]
    public string? Position { get; set; }

    [StringLength(100)]
    public string? Industry { get; set; }

    [StringLength(20)]
    public string? Experience { get; set; }

    [StringLength(200)]
    public string? CompanyWebsite { get; set; }

    [StringLength(20)]
    public string? CompanySize { get; set; }

    [StringLength(500)]
    public string? Bio { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}
