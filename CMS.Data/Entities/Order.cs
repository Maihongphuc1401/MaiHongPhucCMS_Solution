using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CMS.Data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Ngày đặt hàng không được để trống")]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Vui lòng chọn khách hàng")]
        public int CustomerId { get; set; }

        [Range(0, 2,
            ErrorMessage = "Trạng thái đơn hàng không hợp lệ")]
        public int Status { get; set; }

        [StringLength(500,
            ErrorMessage = "Ghi chú tối đa 500 ký tự")]
        public string? Notes { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
