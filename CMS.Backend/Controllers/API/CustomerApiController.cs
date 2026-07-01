using BCrypt.Net;
using CMS.Data;
using CMS.Data.DTOS;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API ĐĂNG KÝ (Nhận vào CustomerRegisterDto)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra trùng Email
            var isExist = await _context.Customers
                .AnyAsync(c => c.Email.ToLower() == dto.Email.ToLower());
            if (isExist)
            {
                return BadRequest(new { message = "⚠️ Email này đã được đăng ký trên hệ thống!" });
            }

            // 🌟 ÁNH XẠ (MAPPING) TỪ DTO SANG ENTITY ĐỂ LƯU VÀO DB
            var customer = new Customer
            {
                FullName = dto.FullName.Trim(),
                Email = dto.Email.Trim(),
                Phone = dto.Phone.Trim(),
                Address = dto.Address.Trim(),
                // Mã hóa mật khẩu từ DTO trước khi gán vào Entity
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password.Trim())
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "🎉 Đăng ký tài khoản thành công!" });
        }

        // 2. API ĐĂNG NHẬP (Nhận vào CustomerLoginDto)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Tìm khách hàng theo email
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == dto.Email.ToLower());

            // Kiểm tra mật khẩu băm BCrypt
            if (customer == null || !BCrypt.Net.BCrypt.Verify(dto.Password, customer.Password))
            {
                return Unauthorized(new { message = "⚠️ Tài khoản hoặc mật khẩu không chính xác!" });
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
        // GET: api/CustomerApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(new { message = "❌ Không tìm thấy khách hàng này!" });
            }

            // Trả về thông tin cơ bản
            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }
    }
}