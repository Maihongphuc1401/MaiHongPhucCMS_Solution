using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        // Dữ liệu mẫu
        static List<Category> list = new List<Category>
        {
            new Category
            {
                Id = 1,
                Name = "Tin Công Nghệ",
                Description = "Review Laptop, AI"
            },

            new Category
            {
                Id = 2,
                Name = "Giáo Dục",
                Description = "Thông tin tuyển sinh"
            }
        };

        // DANH SÁCH
        public IActionResult Index()
        {
            return View(list);
        }

        // CHI TIẾT
        public IActionResult Details(int id)
        {
            var category = list.FirstOrDefault(x => x.Id == id);

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
            category.Id = list.Max(x => x.Id) + 1;

            list.Add(category);

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var category = list.FirstOrDefault(x => x.Id == id);

            return View(category);
        }

        // LƯU SỬA
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            var oldCategory = list.FirstOrDefault(x => x.Id == category.Id);

            oldCategory.Name = category.Name;
            oldCategory.Description = category.Description;

            return RedirectToAction("Index");
        }

        // XÓA
        public IActionResult Delete(int id)
        {
            var category = list.FirstOrDefault(x => x.Id == id);

            list.Remove(category);

            return RedirectToAction("Index");
        }
    }
}