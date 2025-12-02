using backend.Models;
using backend.Repositories.Interfaces;
using backend.Utilities.Classes;
using backend.Utilities.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace backend.Utilities.Services 
{ 
    public class EmailSend : IEmailSend
    {
        private readonly EmailCreds _emailCreds;
        private readonly IEmailVerificationRepo _emailVerificationRepo;
        private readonly IPasswordResetRepo _passwordResetRepo;
        private readonly string _frontedUrl;

        public EmailSend(IOptions<EmailCreds> emailCreds, IEmailVerificationRepo emailVerificationRepo, IConfiguration config, IPasswordResetRepo passwordResetRepo)
        {
            _emailCreds = emailCreds.Value;
            _emailVerificationRepo = emailVerificationRepo;
            _frontedUrl = config["FrontendUrl"]!;
            _passwordResetRepo = passwordResetRepo;
        }

        private async Task SendEmail(User user, string subject, string body) 
        { 
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Tulum", _emailCreds.VerificationEmail));
            message.To.Add(new MailboxAddress(user.Name, user.Email));
            message.Subject = subject;
            
            message.Body = new TextPart("html") 
            { 
                Text = body
            };
            
            using (var smtp = new SmtpClient()) 
            { 
                smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate(_emailCreds.VerificationEmail, _emailCreds.AppPassword);
                await smtp.SendAsync(message);
                smtp.Disconnect(true); 
            } 
        }

        public async Task SendVerificationEmail(User user)
        {
            string token = await _emailVerificationRepo.CreateEmailVerificationTokenAsync(user.Id);
            var verificationLink = $"{_frontedUrl}/verify-email?token={token}";

            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Utilities", "EmailTemplates", "EmailVerificationTemplate.html");
            var htmlTemplate = await File.ReadAllTextAsync(templatePath);

            string body = htmlTemplate
                .Replace("{{USER_NAME}}", user.Name)
                .Replace("{{VERIFICATION_LINK}}", verificationLink)
                .Replace("{{SUPPORT_EMAIL}}", _emailCreds.SupportEmail)
                .Replace("{{USER_EMAIL}}", user.Email)
                .Replace("{{YEAR}}", DateTime.Now.Year.ToString());

            string subject = "Verify your email address";

            await SendEmail(user, subject, body);
        }

        public async Task SendPasswordRestoreEmail(User user)
        {
            string token = await _passwordResetRepo.CreatePasswordResetTokenAsync(user.Id);
            var resetLink = $"{_frontedUrl}/reset-password?token={token}";

            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Utilities", "EmailTemplates", "PasswordResetTemplate.html");
            var htmlTemplate = await File.ReadAllTextAsync(templatePath);

            string body = htmlTemplate
                .Replace("{{USER_NAME}}", user.Name)
                .Replace("{{RESET_LINK}}", resetLink)
                .Replace("{{SUPPORT_EMAIL}}", _emailCreds.SupportEmail)
                .Replace("{{USER_EMAIL}}", user.Email)
                .Replace("{{YEAR}}", DateTime.Now.Year.ToString());

            string subject = "Reset your password";

            await SendEmail(user, subject, body);
        }
    } 
}
