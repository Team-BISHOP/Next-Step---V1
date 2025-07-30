using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;
using System.Security.Claims;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfilesController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _profileService.GetProfileAsync(userId.Value);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto updateDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _profileService.UpdateProfileAsync(userId.Value, updateDto);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpGet("{userId}/public")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicProfile(int userId)
    {
        var result = await _profileService.GetPublicProfileAsync(userId);

        if (result.Success)
            return Ok(result);
        else
            return NotFound(result);
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudentProfiles([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Only industry experts can access this endpoint
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (userRole != "industry_expert")
            return Forbid();

        var result = await _profileService.GetStudentProfilesAsync(page, pageSize);

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
