using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface ISubscriptionService
{
    Task<ApiResponse<object>> SubscribeAsync(SubscribeDto subscribeDto);
    Task<ApiResponse<object>> UnsubscribeAsync(UnsubscribeDto unsubscribeDto);
}