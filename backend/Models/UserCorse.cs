namespace NextStepBackend.Models;

public class UserCourse
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public bool IsCompleted { get; set; } = false;

    public int Progress { get; set; } = 0; // 0-100

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Course Course { get; set; } = null!;
}