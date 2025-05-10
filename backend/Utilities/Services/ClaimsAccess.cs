using backend.Utilities.Interfaces;
using System.Security.Claims;

namespace backend.Utilities.Services
{
    public class ClaimsAccess : IClaimsAccess
    {
        public int GetUserIdFromClaims(HttpContext httpContext)
        {
            var identity = httpContext.User.Identity as ClaimsIdentity;
            var userId = identity!.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            return Int32.Parse(userId);
        }
    }
}
