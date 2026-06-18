/*
 * Ho Va Ten: Mai Hong Phuc
 * mssv: 2123110025
 * class: post
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề bài viết không được để trống")]
        [StringLength(200,
            ErrorMessage = "Tiêu đề tối đa 200 ký tự")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Nội dung bài viết không được để trống")]
        public string Content { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn hình ảnh")]
        public string ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }

        public virtual Category? Category { get; set; }
    }
}
