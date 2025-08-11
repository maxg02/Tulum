using backend.Models;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using backend.Dtos.Auth;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _authRepo;
        private readonly IUserRepo _userRepo;

        public AuthController(IAuthRepo authRepo, IUserRepo userRepo)
        {
            _authRepo = authRepo;
            _userRepo = userRepo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequestDto userDto)
        {
            if (await _userRepo.UserExists(userDto.Email))
            {
                ModelState.AddModelError("Email", "There is already an account associated with this email");
            }

            if (!ModelState.IsValid) {
                return ValidationProblem(ModelState);
            }

            User user = await _authRepo.RegisterAsync(userDto.ToUserFromRegisterDto());
            return Ok(user.ToUserDto());
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] UserAuthRequestDto userDto)
        {
            User? user = await _authRepo.LogInAsync(userDto.Email);

            if (user == null)
            {
                return NotFound(new { error = "User Not Found" });
            }

            if(new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, userDto.Password) == PasswordVerificationResult.Failed)
            {
                return BadRequest(new {error = "Invalid Password"});
            }         

            return Ok(new TokenDto()
            {
                AccessToken = CreateAccessToken(user),
                RefreshToken = await CreateRefreshToken(user)
            });
        }

        [HttpPost("refreshAccessToken")]
        public async Task<IActionResult> GetAccessTokenFromRefresh([FromBody] UserRefreshTokenRequestDto refreshTokenDto)
        {            
            User? user = await ValidateRefreshToken(refreshTokenDto.RefreshToken);

            if (user == null)
            {
                return Unauthorized("Invalid refresh token");
            }

            return Ok(new TokenDto()
            {
                AccessToken = CreateAccessToken(user),
                RefreshToken = await CreateRefreshToken(user)
            });
        }

        private static string CreateAccessToken(User user)
        {
            Dictionary<string, object> claims = new()
            {
                {ClaimTypes.Name, user.Name},
                {ClaimTypes.NameIdentifier, user.Id },
                {ClaimTypes.Email, user.Email},
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("lavidaesunalentejatulatomaoladejalavidaesunalentejaasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadsfasdfasdfasdfadsfadsfasdfadsfadsf"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Claims = claims,
                Expires = DateTime.Now.AddMinutes(60),
                Issuer = "MyApp",
                Audience = "MyUsers",
                SigningCredentials = creds
            };

            return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
        }
        private async Task<string> CreateRefreshToken(User user)
        {
            string refreshToken = Guid.NewGuid().ToString();
            await _authRepo.SaveRefreshTokenAsync(refreshToken, user);

            return refreshToken;
        }
        
        private async Task<User?> ValidateRefreshToken(string refreshToken)
        {
            User? user = await _authRepo.ValidateRefreshTokenAsync(refreshToken);

            if (user == null || user.RefreshTokenExpireDate < DateTime.Now)
            {
                return null;
            }

            return user;
        } 
    }
}
