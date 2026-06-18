/*
 * Ho Va Ten: Mai Hong Phuc
 * mssv: 2123110025
 * Ngày tạo 14/05/2026 - 20:00
 *1. Mục đích: Tạo lớp Category để quản lý thông tin về danh mục bài viết trong hệ thống CMS.
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100,
            ErrorMessage = "Tên danh mục tối đa 100 ký tự")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mô tả danh mục không được để trống")]
        [StringLength(500,
            ErrorMessage = "Mô tả tối đa 500 ký tự")]
        public string Description { get; set; }

        public virtual ICollection<Post>? Posts { get; set; }
    }
}
