using Microsoft.AspNetCore.Mvc;
using NextStepBackend.Models.DTOs;
using NextStepBackend.Services;

namespace NextStepBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto subscribeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _subscriptionService.SubscribeAsync(subscribeDto);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }

    [HttpPost("unsubscribe")]
    public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeDto unsubscribeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid data",
                Error = ModelState
            });
        }

        var result = await _subscriptionService.UnsubscribeAsync(unsubscribeDto);

        if (result.Success)
            return Ok(result);
        else
            return BadRequest(result);
    }
}