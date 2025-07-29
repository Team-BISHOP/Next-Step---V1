using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;
using System.Security.Claims;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses([FromQuery] string? level = null, [FromQuery] string? category = null)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _courseService.GetCoursesAsync(userId.Value, level, category);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("{courseId}")]
    public async Task<IActionResult> GetCourse(int courseId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _courseService.GetCourseAsync(courseId, userId.Value);

        if (result.Success)
            return Ok(result);
        else
            return NotFound(result);
    }

    [HttpPost("{courseId}/enroll")]
    public async Task<IActionResult> EnrollInCourse(int courseId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _courseService.EnrollInCourseAsync(userId.Value, courseId);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPut("{courseId}/progress")]
    public async Task<IActionResult> UpdateProgress(int courseId, [FromBody] UpdateProgressRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _courseService.UpdateProgressAsync(userId.Value, courseId, request.Progress);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPost("{courseId}/complete")]
    public async Task<IActionResult> CompleteCourse(int courseId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _courseService.CompleteCourseAsync(userId.Value, courseId);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (int.TryParse(userIdClaim, out int userId))
            return userId;
        return null;
    }
}

public class UpdateProgressRequest
{
    public int Progress { get; set; }
}
