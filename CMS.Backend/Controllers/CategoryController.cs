using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên,Biên tập viên")]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DANH SÁCH
        public IActionResult Index()
        {
            var list = _context.Categories.ToList();

            return View(list);
        }

        // CHI TIẾT
        public IActionResult Details(int id)
        {
            var category = _context.Categories
                .FirstOrDefault(x => x.Id == id);

            return View(category);
        }

        // FORM THÊM
        public IActionResult Create()
        {
            return View();
        }

        // LƯU THÊM
        [HttpPost]
        public IActionResult Create(Category category)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Add(category);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(category);
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var category = _context.Categories
                .FirstOrDefault(x => x.Id == id);

            return View(category);
        }

        // LƯU SỬA
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Update(category);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(category);
        }

        // XÓA
        public IActionResult Delete(int id)
        {
            var category = _context.Categories
                .FirstOrDefault(x => x.Id == id);

            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}