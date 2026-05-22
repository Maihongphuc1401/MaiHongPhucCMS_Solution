using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Dữ liệu mẫu
        static List<User> list = new List<User>
        {
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = "123456",
                FullName = "Mai Hồng Phúc",
                Role = "Quản trị viên"
            },

            new User
            {
                Id = 2,
                Username = "editor01",
                PasswordHash = "123456",
                FullName = "Nguyễn Văn A",
                Role = "Biên tập viên"
            }
        };

        // HIỂN THỊ DANH SÁCH
        public IActionResult Index()
        {
            return View(list);
        }

        // CHI TIẾT
        public IActionResult Details(int id)
        {
            var user = list.FirstOrDefault(x => x.Id == id);

            return View(user);
        }

        // FORM THÊM
        public IActionResult Create()
        {
            return View();
        }

        // LƯU THÊM
        [HttpPost]
        public IActionResult Create(User user)
        {
            user.Id = list.Max(x => x.Id) + 1;

            list.Add(user);

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var user = list.FirstOrDefault(x => x.Id == id);

            return View(user);
        }

        // LƯU SỬA
        [HttpPost]
        public IActionResult Edit(User user)
        {
            var oldUser = list.FirstOrDefault(x => x.Id == user.Id);

            oldUser.Username = user.Username;
            oldUser.PasswordHash = user.PasswordHash;
            oldUser.FullName = user.FullName;
            oldUser.Role = user.Role;

            return RedirectToAction("Index");
        }

        // XÓA
        public IActionResult Delete(int id)
        {
            var user = list.FirstOrDefault(x => x.Id == id);

            list.Remove(user);

            return RedirectToAction("Index");
        }
    }
}