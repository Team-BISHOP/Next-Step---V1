using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface ILeaderboardService
{
    Task<ApiResponse<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int page, int pageSize);
    Task<ApiResponse<object>> GetUserRankAsync(int userId);
}
