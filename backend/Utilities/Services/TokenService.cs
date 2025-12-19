using backend.Models;
using backend.Repositories.Interfaces;
using backend.Utilities.Classes;
using backend.Utilities.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace backend.Utilities.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtInfo _jwtInfo;
        private readonly ITokenRepo _authRepo;

        public TokenService(IOptions<JwtInfo> jwtInfo, ITokenRepo authRepo)
        {
            _jwtInfo = jwtInfo.Value;
            _authRepo = authRepo;
        }

        public string CreateAccessToken(User user)
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
        public async Task<string> CreateRefreshToken(User user)
        {
            string refreshToken = Guid.NewGuid().ToString();
            await _authRepo.SaveRefreshTokenAsync(refreshToken, user);

            return refreshToken;
        }

        public async Task<User?> ValidateRefreshToken(string refreshToken)
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
