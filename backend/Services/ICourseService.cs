using NextStepBackend.Models.DTOs;

namespace NextStepBackend.Services;

public interface ICourseService
{
    Task<ApiResponse<List<CourseDto>>> GetCoursesAsync(int userId, string? level = null, string? category = null);
    Task<ApiResponse<CourseDto>> GetCourseAsync(int courseId, int userId);
    Task<ApiResponse<string>> EnrollInCourseAsync(int userId, int courseId);
    Task<ApiResponse<string>> UpdateProgressAsync(int userId, int courseId, int progress);
    Task<ApiResponse<string>> CompleteCourseAsync(int userId, int courseId);
}
