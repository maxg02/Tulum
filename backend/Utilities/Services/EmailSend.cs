using backend.Models;
using backend.Repositories.Interfaces;
using backend.Utilities.Classes;
using backend.Utilities.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System;

namespace backend.Utilities.Services 
{ 
    public class EmailSend : IEmailSend
    {
        private readonly EmailCreds _emailCreds;
        private readonly IEmailVerificationRepo _emailVerificationRepo;

        public EmailSend(IOptions<EmailCreds> emailCreds, IEmailVerificationRepo emailVerificationRepo)
        {
            _emailCreds = emailCreds.Value;
            _emailVerificationRepo = emailVerificationRepo;
        }

        private async Task SendEmail(User user, string subject, string body) 
        { 
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Tulum", _emailCreds.VerificationEmail));
            message.To.Add(new MailboxAddress(user.Name, user.Email));
            message.Subject = subject;
            
            message.Body = new TextPart("plain") 
            { 
                Text = body
            };
            
            using (var smtp = new SmtpClient()) 
            { 
                smtp.Connect("smtp.gmail.com", 587, true);
                smtp.Authenticate(_emailCreds.VerificationEmail, _emailCreds.AppPassword);
                await smtp.SendAsync(message);
                smtp.Disconnect(true); 
            } 
        }

        public async Task SendVerificationEmail(User user)
        {
            string token = await _emailVerificationRepo.CreateEmailVerificationCodeAsync(user.Id);
            var verificationLink = Url.Action("VerifyEmail", "Auth", new { token }, Request.Scheme, Request.Host.Value);

            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Utilities", "EmailTemplates", "EmailVerificationTemplate.html");
            var htmlTemplate = await File.ReadAllTextAsync(templatePath);

            string emailBody = htmlTemplate
                .Replace("{{UserName}}", user.Name)
                .Replace("{{VerificationLink}}", verificationLink);




            string subject = "Verify your email address";
            string body = $"Hello {user.Name},\n\nPlease verify your email address by clicking the link below:\n\n" +
                          $"http://yourfrontenddomain.com/verify-email?email={user.Email}\n\n" +
                          "If you did not create an account, please ignore this email.\n\nThank you!";
            await SendEmail(user, subject, body);
        }
    } 
}
