using System.ComponentModel.DataAnnotations;

namespace NextStepBackend.Models;

public class Subscription
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(100)]
    public string? FullName { get; set; }

    [StringLength(20)]
    public string Status { get; set; } = "active"; // active, inactive

    [StringLength(100)]
    public string? ServiceType { get; set; } = "newsletter"; // newsletter, updates, etc.

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UnsubscribedAt { get; set; }
}