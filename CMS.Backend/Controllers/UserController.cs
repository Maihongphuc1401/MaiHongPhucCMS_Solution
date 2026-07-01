using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.ViewModel;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách
        public IActionResult Index(string keyword = "", int page = 1)
        {
            int pageSize = 5;
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.Username.Contains(keyword) ||
                    x.FullName.Contains(keyword));
            }

            int totalItems = query.Count();

            var users = query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<User>
            {
                Items = users,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                Keyword = keyword
            };

            return View(model);
        }

        // Chi tiết
        public IActionResult Details(int id)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == id);
            if (user == null) return NotFound();

            return View(user);
        }

        // Form thêm
        public IActionResult Create()
        {
            return View();
        }

        // Lưu thêm (Băm mật khẩu trước khi lưu)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User user)
        {
            if (!ModelState.IsValid)
                return View(user);

            // Sử dụng BCrypt để băm mật khẩu bảo mật tuyệt đối
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            _context.Users.Add(user);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // Form sửa
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            // Xóa chuỗi hash đi trước khi đưa vào form để tránh lộ chuỗi băm
            user.PasswordHash = "";
            return View(user);
        }

        // Lưu sửa (Chỉ đổi mật khẩu nếu quản trị viên nhập mật khẩu mới)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User user)
        {
            var existingUser = _context.Users.Find(id);
            if (existingUser == null) return NotFound();

            // Gỡ bỏ kiểm tra Validation của thuộc tính PasswordHash nếu người dùng để trống (không muốn đổi mật khẩu)
            if (string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                ModelState.Remove(nameof(user.PasswordHash));
            }

            if (!ModelState.IsValid)
                return View(user);

            // Cập nhật thông tin cơ bản
            existingUser.Username = user.Username;
            existingUser.FullName = user.FullName;
            existingUser.Role = user.Role;

            // Nếu có nhập mật khẩu mới thì mới tiến hành băm và cập nhật
            if (!string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            }

            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // Xác nhận xóa
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // Xóa thật
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}