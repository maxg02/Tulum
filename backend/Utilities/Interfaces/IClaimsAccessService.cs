namespace backend.Utilities.Interfaces
{
    public interface IClaimsAccessService
    {
        int GetUserIdFromClaims(HttpContext httpContext);
    };
}
