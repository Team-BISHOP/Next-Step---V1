using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponseDto>> RegisterAsync(RegisterDto registerDto);
    Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginDto loginDto);
    string GenerateJwtToken(int userId, string email, string role);
}
