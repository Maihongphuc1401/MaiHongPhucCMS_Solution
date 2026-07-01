using System.ComponentModel.DataAnnotations;

namespace CMS.Data.DTOS
{
    public class OrderCreateDto
    {

        public int CustomerId { get; set; }

        public string? Notes { get; set; }
        public string? CustomerEmail { get; set; }

        // Các trường nhận thông tin tạm thời để gửi Mail (Không cần map vào DB)
        public string? ShippingName { get; set; }
        public string? ShippingPhone { get; set; }
        public string? ShippingAddress { get; set; }

        [Required]
        public List<OrderDetailDto> OrderDetails { get; set; }


        //[Required]
        //public int CustomerId { get; set; }

        //// 🚀 Bổ sung các trường thông tin giao hàng và email nhận từ React
        //public string CustomerEmail { get; set; }

        //[Required(ErrorMessage = "Tên người nhận không được để trống")]
        //public string ShippingName { get; set; }

        //[Required(ErrorMessage = "Số điện thoại không được để trống")]
        //public string ShippingPhone { get; set; }

        //[Required(ErrorMessage = "Địa chỉ không được để trống")]
        //public string ShippingAddress { get; set; }

        //public string Notes { get; set; }

        //[Required]
        //public List<OrderDetailDto> OrderDetails { get; set; }
    }

    public class OrderDetailDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal UnitPrice { get; set; }
    }
}