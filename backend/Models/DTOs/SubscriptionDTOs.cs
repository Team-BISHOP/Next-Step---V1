using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models.DTOs;

public class SubscribeDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? FullName { get; set; }

    public string? ServiceType { get; set; } = "newsletter";
}

public class UnsubscribeDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? ServiceType { get; set; } = "newsletter";
}