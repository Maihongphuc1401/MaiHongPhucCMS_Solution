using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên,Biên tập viên")]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // DANH SÁCH
        // ==========================
        public IActionResult Index(string keyword = "")
        {
            var query = _context.CategoriesProducts
                .Include(x => x.Products)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }

            var data = query
                .OrderBy(x => x.Id)
                .ToList();

            ViewBag.Keyword = keyword;

            return View(data);
        }

        // ==========================
        // CHI TIẾT
        // ==========================
        public IActionResult Details(int id)
        {
            var category = _context.CategoriesProducts
                .Include(x => x.Products)
                .FirstOrDefault(x => x.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // ==========================
        // THÊM
        // ==========================
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            bool exists = _context.CategoriesProducts
                .Any(x => x.Name == model.Name);

            if (exists)
            {
                ModelState.AddModelError("Name", "Tên danh mục đã tồn tại.");
                return View(model);
            }

            _context.CategoriesProducts.Add(model);

            _context.SaveChanges();

            TempData["success"] = "Thêm danh mục thành công.";

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // SỬA
        // ==========================
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(CategoryProduct model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            bool exists = _context.CategoriesProducts
                .Any(x => x.Name == model.Name && x.Id != model.Id);

            if (exists)
            {
                ModelState.AddModelError("Name", "Tên danh mục đã tồn tại.");
                return View(model);
            }

            _context.CategoriesProducts.Update(model);

            _context.SaveChanges();

            TempData["success"] = "Cập nhật thành công.";

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // XÓA
        // ==========================
        [Authorize(Roles = "Quản trị viên")]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts
                .FirstOrDefault(x => x.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        [HttpPost, ActionName("Delete")]
        [Authorize(Roles = "Quản trị viên")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var category = _context.CategoriesProducts
                .Include(x => x.Products)
                .FirstOrDefault(x => x.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            if (category.Products != null && category.Products.Any())
            {
                TempData["error"] = "Không thể xóa vì danh mục đang chứa sản phẩm.";

                return RedirectToAction(nameof(Index));
            }

            _context.CategoriesProducts.Remove(category);

            _context.SaveChanges();

            TempData["success"] = "Xóa thành công.";

            return RedirectToAction(nameof(Index));
        }
    }
}