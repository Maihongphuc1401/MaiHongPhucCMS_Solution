using CMS.Data;
using CMS.Data.DTOS;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CMS.Backend.Services; 

namespace CMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        public OrderApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            // Bỏ check tự động để tránh dính lỗi BadRequest ẩn khi map DTO
            // if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.OrderDetails == null || dto.OrderDetails.Count == 0)
            {
                return BadRequest(new { message = "⚠️ Chi tiết đơn hàng không được để trống!" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Tạo thực thể Order KHỚP 100% bảng hiện tại trong DB của bạn
                var order = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = dto.CustomerId, // Nhận int trực tiếp từ DTO 
                    Status = 0,
                    Notes = dto.Notes?.Trim()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Lưu trước lấy Id tự tăng

                // 2. Thêm danh sách chi tiết đơn hàng (OrderDetail)
                foreach (var item in dto.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"❌ Sản phẩm mã #{item.ProductId} không tồn tại!" });
                    }
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"❌ Sản phẩm '{product.Name}' không đủ số lượng trong kho!" });
                    }

                    // Giảm số lượng tồn kho sản phẩm
                    product.StockQuantity -= item.Quantity;

                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };
                    _context.OrderDetails.Add(orderDetail);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync(); // Xác nhận lưu đơn hàng thành công vào DB
                if (!string.IsNullOrEmpty(dto.CustomerEmail))
                {
                    try
                    {
                        // Lấy Service thủ công từ HttpContext, nếu chưa cấu hình trong Program.cs cũng không làm sập API
                        var emailService = HttpContext.RequestServices.GetService<IEmailService>();

                        if (emailService != null)
                        {
                            string subject = $"🎉 Đơn hàng #{order.Id} đã đặt thành công";
                            string body = $@"
                                <div style='font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                                    <h3 style='color: #16a34a;'>Cảm ơn {dto.ShippingName} đã đặt hàng!</h3>
                                    <p>Hệ thống đã ghi nhận thông tin giao hàng tạm thời của đơn hàng <b>#{order.Id}</b>:</p>
                                    <ul>
                                        <li><b>Người nhận:</b> {dto.ShippingName}</li>
                                        <li><b>Số điện thoại:</b> {dto.ShippingPhone}</li>
                                        <li><b>Địa chỉ giao nhận:</b> {dto.ShippingAddress}</li>
                                        <li><b>Ghi chú:</b> {dto.Notes ?? "Không có"}</li>
                                    </ul>
                                    <p style='font-size: 12px; color: #64748b;'><i>* Lưu ý: Thông tin nhận hàng trên chỉ dùng gửi mail tạm thời, không lưu vào database.</i></p>
                                </div>";

                            await emailService.SendEmailAsync(dto.CustomerEmail, subject, body);
                        }
                    }
                    catch (Exception mailEx)
                    {
                        // Chỉ ghi log lỗi mail ra màn hình Console của máy, không báo lỗi về React
                        Console.WriteLine("Lỗi gửi mail tạm thời: " + mailEx.Message);
                    }
                }

                return Ok(new { message = "🎉 Đặt hàng thành công!", orderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo đơn hàng!", detail = ex.Message });
            }
        }

    }
}