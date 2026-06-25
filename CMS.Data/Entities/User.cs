using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        [StringLength(50, ErrorMessage = "Tên đăng nhập tối đa 50 ký tự")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [StringLength(100, MinimumLength = 6,
            ErrorMessage = "Mật khẩu từ 6 đến 100 ký tự")]
        public string PasswordHash { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        [StringLength(100, ErrorMessage = "Họ tên tối đa 100 ký tự")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Vai trò không được để trống")]
        public string Role { get; set; } = "Người dùng";
    }
}