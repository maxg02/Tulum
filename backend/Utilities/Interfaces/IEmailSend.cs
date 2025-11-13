using backend.Models;

namespace backend.Utilities.Interfaces
{
    public interface IEmailSend
    {
        Task SendEmail(User user, string subject, string body);
        Task SendVerificationEmail(User user);
    }
}