using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] int? userId = null)
    {
        var result = await _projectService.GetProjectsAsync(userId);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        var result = await _projectService.GetProjectAsync(projectId);

        if (result.Success)
            return Ok(result);
        else
            return NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _projectService.CreateProjectAsync(userId.Value, projectDto);

        if (result.Success)
            return CreatedAtAction(nameof(GetProject), new { projectId = result.Data!.Id }, result);
        else
            return BadRequest(result);
    }

    [HttpPut("{projectId}")]
    public async Task<IActionResult> UpdateProject(int projectId, [FromBody] ProjectDto projectDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _projectService.UpdateProjectAsync(projectId, userId.Value, projectDto);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpDelete("{projectId}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _projectService.DeleteProjectAsync(projectId, userId.Value);

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
