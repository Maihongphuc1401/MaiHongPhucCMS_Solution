using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.ViewModel;
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
        public IActionResult Index(string keyword = "", int page = 1)
        {
            int pageSize = 5;

            var query = _context.Categories.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.Name.Contains(keyword));
            }

            int totalItems = query.Count();

            var data = query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<Category>
            {
                Items = data,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                Keyword = keyword
            };

            return View(model);
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