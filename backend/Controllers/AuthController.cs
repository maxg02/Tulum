using backend.Dtos.Auth;
using backend.Mappers;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Utilities.Classes;
using backend.Utilities.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepo _userRepo;
        private readonly IEmailSendService _emailSend;
        private readonly IEmailVerificationRepo _emailVerificationRepo;
        private readonly IPasswordResetRepo _passwordResetRepo;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthController(ITokenRepo authRepo, IUserRepo userRepo, IOptions<JwtInfo> jwtInfo, IEmailSendService emailSend, IEmailVerificationRepo emailVerification, IPasswordResetRepo passwordResetRepo, IPasswordHasher<User> passwordHasher, ITokenService tokenService)
        {
            _userRepo = userRepo;
            _emailSend = emailSend;
            _emailVerificationRepo = emailVerification;
            _passwordResetRepo = passwordResetRepo;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
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
        public async Task<IActionResult> ResendEmailVerification([FromBody] UserResendEmailVerificationDto resendEmailVerificationDto)
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

            EmailVerificationToken? emailVerification = await _emailVerificationRepo.GetLastEmailVerificationTokenAsync(user.Id);

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

        [HttpPost("send-password-reset")]
        public async Task<IActionResult> SendPasswordReset([FromBody] UserSendPasswordResetDto passwordResetDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            User? user = await _userRepo.GetByEmailAsync(passwordResetDto.Email);

            if (user == null || !user.isVerified)
            {
                ModelState.AddModelError("User", "Email is not registered or is not verified");
                return ValidationProblem(ModelState);
            }

            PasswordResetToken? passwordResetLastToken = await _passwordResetRepo.GetLastPasswordResetTokenAsync(user.Id);

            if (passwordResetLastToken != null)
            {
                DateTime limitDate = passwordResetLastToken.ExpiresAt.AddMinutes(-10);
                if (limitDate > DateTime.UtcNow)
                {
                    ModelState.AddModelError("Time", "Please wait 5 minutes to resend the password restoring email");
                    return ValidationProblem(ModelState);
                }
            }

            await _emailSend.SendPasswordRestoreEmail(user);

            return NoContent();
        }

        [HttpPost("password-reset")]
        public async Task<IActionResult> RestorePassword([FromBody] UserRestorePasswordDto restorePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            int? resetTokenUserId = await _passwordResetRepo.VerifyTokenAsync(restorePasswordDto.VerificationToken);

            if (resetTokenUserId == null)
            {
                ModelState.AddModelError("Token", "Invalid or expired token");
                return ValidationProblem(ModelState);
            }

            string passwordHash = _passwordHasher.HashPassword(new User(), restorePasswordDto.NewPassword);

            await _userRepo.ResetPasswordAsync(resetTokenUserId.Value, passwordHash);

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

            if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password) == PasswordVerificationResult.Failed)
            {
                ModelState.AddModelError("User", "Incorrect email or password");
                return ValidationProblem(ModelState);
            }            

            return Ok(new TokenDto()
            {
                AccessToken = _tokenService.CreateAccessToken(user),
                RefreshToken = await _tokenService.CreateRefreshToken(user)
            });
        }

        [HttpPost("refreshAccessToken")]
        public async Task<IActionResult> GetAccessTokenFromRefresh([FromBody] UserRefreshTokenRequestDto refreshTokenDto)
        {            
            User? user = await _tokenService.ValidateRefreshToken(refreshTokenDto.RefreshToken);

            if (user == null)
            {
                return Unauthorized("Invalid refresh token");
            }

            return Ok(new TokenDto()
            {
                AccessToken = _tokenService.CreateAccessToken(user),
                RefreshToken = await _tokenService.CreateRefreshToken(user)
            });
        }        
    }
}
