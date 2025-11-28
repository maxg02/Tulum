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
using backend.Utilities.Classes;
using Microsoft.Extensions.Options;
using backend.Utilities.Interfaces;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _authRepo;
        private readonly IUserRepo _userRepo;
        private readonly JwtInfo _jwtInfo;
        private readonly IEmailSend _emailSend;
        private readonly IEmailVerificationRepo _emailVerificationRepo;

        public AuthController(IAuthRepo authRepo, IUserRepo userRepo, IOptions<JwtInfo> jwtInfo, IEmailSend emailSend, IEmailVerificationRepo emailVerification)
        {
            _authRepo = authRepo;
            _userRepo = userRepo;
            _jwtInfo = jwtInfo.Value;
            _emailSend = emailSend;
            _emailVerificationRepo = emailVerification;
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] UserEmailVerificationDto emailVerificationDto)
        {
            int? validationTokenUserId = await _emailVerificationRepo.VerifyTokenAsync(emailVerificationDto.VerificationToken);

            if (validationTokenUserId == null)
            {
                return BadRequest("Invalid or expired token");
            }

            await _userRepo.ValidateEmailVerificationAsync(validationTokenUserId.Value);

            return NoContent();
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendEmailVerification([FromBody] UserResendEmailVerification resendEmailVerificationDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            User? user = await _userRepo.GetByEmailAsync(resendEmailVerificationDto.Email);

            if (user == null)
            {
                ModelState.AddModelError("User", "Email is not registered");
                return ValidationProblem(ModelState);
            }

            if (user.isVerified)
            {
                ModelState.AddModelError("User", "User is already verified");
                return ValidationProblem(ModelState);
            }

            VerificationToken? emailVerification = await _emailVerificationRepo.GetLastEmailVerificationAsync(user.Id);

            if (emailVerification != null)
            {
                DateTime limitDate = emailVerification.ExpiresAt.AddMinutes(-10);
                if (limitDate > DateTime.UtcNow)
                {
                    ModelState.AddModelError("Time", "Please wait 5 minutes to resend the verification email");
                    return ValidationProblem(ModelState);
                }
            }

            await _emailSend.SendVerificationEmail(user);

            return NoContent();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequestDto userDto)
        {
            if (await _userRepo.GetByEmailAsync(userDto.Email) != null)
            {
                ModelState.AddModelError("User", "The email address is already in use");
            }

            if (!ModelState.IsValid) {
                return ValidationProblem(ModelState);
            }
            
            User user = await _userRepo.CreateAsync(userDto.ToUserFromRegisterDto());

            await _emailSend.SendVerificationEmail(user);

            return Ok(user.ToUserDto());
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] UserAuthRequestDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            User? user = await _userRepo.GetByEmailAsync(userDto.Email);

            if (user == null)
            {
                ModelState.AddModelError("User", "Incorrect email or password");
                return ValidationProblem(ModelState);
            }

            if (!user.isVerified)
            {
                ModelState.AddModelError("User", "User is not verified, check your email");
                return ValidationProblem(ModelState);
            }

            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, userDto.Password) == PasswordVerificationResult.Failed)
            {
                ModelState.AddModelError("User", "Incorrect email or password");
                return ValidationProblem(ModelState);
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

        private string CreateAccessToken(User user)
        {
            Dictionary<string, object> claims = new()
            {
                {ClaimTypes.Name, user.Name},
                {ClaimTypes.NameIdentifier, user.Id },
                {ClaimTypes.Email, user.Email},
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtInfo.SigningKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Claims = claims,
                Expires = DateTime.Now.AddMinutes(60),
                Issuer = _jwtInfo.Issuer,
                Audience = _jwtInfo.Audience,
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
