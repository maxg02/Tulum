using backend.Models;

namespace backend.Utilities.Interfaces
{
    public interface IEmailSendService
    {
        Task SendVerificationEmail(User user);
        Task SendPasswordRestoreEmail(User user);
    }
}