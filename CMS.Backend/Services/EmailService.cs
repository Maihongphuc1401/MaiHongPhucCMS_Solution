using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Thiết lập cấu hình SMTP của Gmail
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("YOUR_EMAIL@gmail.com", "YOUR_APP_PASSWORD"), // Sử dụng Mật khẩu ứng dụng (App Password) của Gmail
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("YOUR_EMAIL@gmail.com", "Alistyle Shop"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true, // Cho phép hiển thị định dạng HTML (bảng, màu sắc...)
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}