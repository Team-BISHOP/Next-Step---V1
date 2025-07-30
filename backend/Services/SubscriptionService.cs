using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly NextStepDbContext _context;

    public SubscriptionService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<object>> SubscribeAsync(SubscribeDto subscribeDto)
    {
        try
        {
            var existingSubscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Email == subscribeDto.Email && s.ServiceType == subscribeDto.ServiceType);

            if (existingSubscription != null)
            {
                if (existingSubscription.Status == "active")
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Already subscribed to this service"
                    };
                }
                else
                {
                    // Reactivate subscription
                    existingSubscription.Status = "active";
                    existingSubscription.UnsubscribedAt = null;
                }
            }
            else
            {
                var subscription = new Subscription
                {
                    Email = subscribeDto.Email,
                    FullName = subscribeDto.FullName,
                    ServiceType = subscribeDto.ServiceType ?? "newsletter",
                    Status = "active"
                };

                _context.Subscriptions.Add(subscription);
            }

            await _context.SaveChangesAsync();

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Successfully subscribed!"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to subscribe",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> UnsubscribeAsync(UnsubscribeDto unsubscribeDto)
    {
        try
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Email == unsubscribeDto.Email &&
                                         s.ServiceType == (unsubscribeDto.ServiceType ?? "newsletter"));

            if (subscription == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = "Subscription not found"
                };
            }

            subscription.Status = "inactive";
            subscription.UnsubscribedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ApiResponse<object>
            {
                Success = true,
                Message = "Successfully unsubscribed"
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to unsubscribe",
                Error = ex.Message
            };
        }
    }
}