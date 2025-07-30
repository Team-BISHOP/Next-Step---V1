using Microsoft.EntityFrameworkCore;
using NextStepBackend.Data;
using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public class LeaderboardService : ILeaderboardService
{
    private readonly NextStepDbContext _context;

    public LeaderboardService(NextStepDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int page, int pageSize)
    {
        try
        {
            var skip = (page - 1) * pageSize;

            var leaderboard = await _context.Users
                .Include(u => u.Profile)
                .Where(u => u.Profile != null)
                .OrderByDescending(u => u.Profile!.Points)
                .ThenByDescending(u => u.Profile!.Level)
                .Skip(skip)
                .Take(pageSize)
                .Select((u, index) => new LeaderboardEntryDto
                {
                    UserId = u.Id,
                    FullName = u.FullName,
                    AvatarUrl = u.Profile!.AvatarUrl,
                    Points = u.Profile.Points,
                    Level = u.Profile.Level,
                    Rank = skip + index + 1,
                    University = u.Profile.University,
                    Major = u.Profile.Major
                })
                .ToListAsync();

            return new ApiResponse<IEnumerable<LeaderboardEntryDto>>
            {
                Success = true,
                Data = leaderboard
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<IEnumerable<LeaderboardEntryDto>>
            {
                Success = false,
                Message = "Failed to retrieve leaderboard",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<object>> GetUserRankAsync(int userId)
    {
        try
        {
            var userProfile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (userProfile == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = "User profile not found"
                };
            }

            var rank = await _context.Profiles
                .CountAsync(p => p.Points > userProfile.Points ||
                                (p.Points == userProfile.Points && p.Level > userProfile.Level)) + 1;

            return new ApiResponse<object>
            {
                Success = true,
                Data = new { Rank = rank, Points = userProfile.Points, Level = userProfile.Level }
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to get user rank",
                Error = ex.Message
            };
        }
    }
}
