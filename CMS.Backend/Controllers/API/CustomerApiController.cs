using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerApiController : ControllerBase
    {
        private readonly YourDbContext _context; // Thay bằng tên DbContext của bạn

        public CustomerApiController(YourDbContext context)
        {
            _context = context;
        }

        // 1. API ĐĂNG KÝ
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer customer)
        {
            // Kiểm tra validate [Required], [EmailAddress] từ Entity Customer
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra trùng Email
            var isExist = await _context.Customers
                .AnyAsync(c => c.Email.ToLower() == customer.Email.ToLower());
            if (isExist)
            {
                return BadRequest(new { message = "⚠️ Email này đã được đăng ký hệ thống!" });
            }

            // Vì 'customer' đã là Entity rồi nên add thẳng vào Database luôn
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "🎉 Đăng ký thành công!" });
        }

        // 2. API ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Customer loginData)
        {
            // Tìm khách hàng theo Email
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == loginData.Email.ToLower());

            // Kiểm tra mật khẩu (so sánh chuỗi thô theo code hiện tại của bạn)
            if (customer == null || customer.Password != loginData.Password)
            {
                return Unauthorized(new { message = "⚠️ Sai tài khoản hoặc mật khẩu!" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email
                }
            });
        }
    }
}