using backend.Models;

namespace backend.Utilities.Interfaces
{
    public interface IEmailSend
    {
        Task SendVerificationEmail(User user);
    }
}