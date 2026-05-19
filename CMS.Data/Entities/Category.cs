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

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }

}
