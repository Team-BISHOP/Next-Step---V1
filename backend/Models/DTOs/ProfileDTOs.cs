namespace NextStepBackend.Models.DTOs;

public class ProfileDto
{
    public string? Avatar { get; set; }
    public string? University { get; set; }
    public string? Degree { get; set; }
    public string? GithubUrl { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string? Industry { get; set; }
    public string? Experience { get; set; }
    public string? Bio { get; set; }
}

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? University { get; set; }
    public int? YearOfStudy { get; set; }
    public string? Major { get; set; }
    public List<string>? Skills { get; set; }
    public List<string>? CareerInterests { get; set; }
    public string? GithubUsername { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? PortfolioUrl { get; set; }

    // Industry expert fields
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string? Industry { get; set; }
    public string? Experience { get; set; }
    public string? CompanyWebsite { get; set; }
    public string? CompanySize { get; set; }
    public string? Bio { get; set; }
}

public class ProfileResponseDto
{
    public int Id { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? University { get; set; }
    public int? YearOfStudy { get; set; }
    public string? Major { get; set; }
    public List<string>? Skills { get; set; }
    public List<string>? CareerInterests { get; set; }
    public string? GithubUsername { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public int Points { get; set; }
    public int Level { get; set; }

    // Industry expert fields
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string? Industry { get; set; }
    public string? Experience { get; set; }
    public string? CompanyWebsite { get; set; }
    public string? CompanySize { get; set; }
    public string? Bio { get; set; }
}
