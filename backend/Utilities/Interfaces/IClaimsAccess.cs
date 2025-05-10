namespace backend.Utilities.Interfaces
{
    public interface IClaimsAccess
    {
        int GetUserIdFromClaims(HttpContext httpContext);
    };
}
