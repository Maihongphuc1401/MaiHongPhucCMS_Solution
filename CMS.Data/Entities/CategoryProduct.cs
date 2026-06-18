using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục sản phẩm không được để trống")]
        [StringLength(100,
            ErrorMessage = "Tên danh mục tối đa 100 ký tự")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mô tả danh mục không được để trống")]
        [StringLength(500,
            ErrorMessage = "Mô tả tối đa 500 ký tự")]
        public string? Description { get; set; }

        public virtual ICollection<Product>? Products { get; set; }
    }
}