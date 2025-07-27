using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NextStepBackend.Configurations;
using NextStepBackend.Data;
using NextStepBackend.Models;
using NextStepBackend.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NextStepBackend.Services;

public class AuthService : IAuthService
{
    private readonly NextStepDbContext _context;
    private readonly JwtSettings _jwtSettings;
    private readonly AppSettings _appSettings;

    public AuthService(NextStepDbContext context, IOptions<JwtSettings> jwtSettings, IOptions<AppSettings> appSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
        _appSettings = appSettings.Value;
    }

    public async Task<ApiResponse<LoginResponseDto>> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return new ApiResponse<LoginResponseDto>
                {
                    Success = false,
                    Message = "User with this email already exists"
                };
            }

            // Create new user
            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = registerDto.Role,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create profile
            var profile = new Profile
            {
                UserId = user.Id,
                Points = _appSettings.DefaultUserPoints,
                Level = _appSettings.DefaultUserLevel,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            // Generate token
            var token = GenerateJwtToken(user.Id, user.Email, user.Role);

            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };

            var response = new LoginResponseDto
            {
                Token = token,
                User = userDto
            };

            return new ApiResponse<LoginResponseDto>
            {
                Success = true,
                Message = "User registered successfully",
                Data = response
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<LoginResponseDto>
            {
                Success = false,
                Message = "Registration failed",
                Error = ex.Message
            };
        }
    }

    public async Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginDto loginDto)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return new ApiResponse<LoginResponseDto>
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var token = GenerateJwtToken(user.Id, user.Email, user.Role);

            var profileData = user.Profile != null ? new ProfileDto
            {
                Avatar = user.Profile.AvatarUrl,
                University = user.Profile.University,
                Degree = user.Profile.Major,
                GithubUrl = user.Profile.GithubUsername != null ? $"https://github.com/{user.Profile.GithubUsername}" : null,
                LinkedinUrl = user.Profile.LinkedinUrl,
                Company = user.Profile.Company,
                Position = user.Profile.Position,
                Industry = user.Profile.Industry,
                Experience = user.Profile.Experience,
                Bio = user.Profile.Bio
            } : null;

            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                ProfileData = profileData
            };

            var response = new LoginResponseDto
            {
                Token = token,
                User = userDto
            };

            return new ApiResponse<LoginResponseDto>
            {
                Success = true,
                Message = "Login successful",
                Data = response
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<LoginResponseDto>
            {
                Success = false,
                Message = "Login failed",
                Error = ex.Message
            };
        }
    }

    public string GenerateJwtToken(int userId, string email, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim("userId", userId.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpiryInHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
