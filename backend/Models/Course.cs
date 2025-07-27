using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class Course
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(50)]
    public string Level { get; set; } = "foundation"; // foundation, intermediate, advanced

    [StringLength(100)]
    public string? Category { get; set; }

    public int XpPoints { get; set; } = 100;

    [StringLength(200)]
    public string? ThumbnailUrl { get; set; }

    [StringLength(300)]
    public string? ExternalUrl { get; set; }

    public int EstimatedHours { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<UserCourse> UserCourses { get; set; } = new List<UserCourse>();
}