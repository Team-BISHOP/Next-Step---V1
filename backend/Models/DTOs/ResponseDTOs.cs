namespace NextStepBackend.Models.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public object? Error { get; set; }
}

public class LeaderboardEntryDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int Points { get; set; }
    public int Level { get; set; }
    public int Rank { get; set; }
    public string? University { get; set; }
    public string? Major { get; set; }
}

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Level { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int XpPoints { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? ExternalUrl { get; set; }
    public int EstimatedHours { get; set; }
    public bool IsEnrolled { get; set; }
    public bool IsCompleted { get; set; }
    public int Progress { get; set; }
}

public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ProjectUrl { get; set; }
    public string? GithubUrl { get; set; }
    public List<string>? Technologies { get; set; }
    public List<string>? ImageUrls { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
}
