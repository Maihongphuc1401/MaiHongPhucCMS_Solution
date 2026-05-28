using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DANH SÁCH
        public IActionResult Index()
        {
            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Status == 1)
                .ToList();

            return View(data);
        }

        // THÙNG RÁC
        public IActionResult Trash()
        {
            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Status == 0)
                .ToList();

            return View(data);
        }

        // CHI TIẾT
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            return View(product);
        }

        // FORM THÊM
        public IActionResult Create()
        {
            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();

            return View();
        }

        // THÊM
        [HttpPost]
        public IActionResult Create(Product product)
        {
            _context.Products.Add(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();

            return View(product);
        }

        // SỬA
        [HttpPost]
        public IActionResult Edit(Product product)
        {
            _context.Products.Update(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // XÓA MỀM
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            product.Status = 0;

            _context.Products.Update(product);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // KHÔI PHỤC
        public IActionResult Restore(int id)
        {
            var product = _context.Products.Find(id);

            product.Status = 1;

            _context.Products.Update(product);

            _context.SaveChanges();

            return RedirectToAction("Trash");
        }

        // XÓA VĨNH VIỄN
        public IActionResult Destroy(int id)
        {
            var product = _context.Products.Find(id);

            _context.Products.Remove(product);

            _context.SaveChanges();

            return RedirectToAction("Trash");
        }
    }
}