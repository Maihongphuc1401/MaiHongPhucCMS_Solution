using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.ViewModel;
namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(
     ApplicationDbContext context,
     IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // DANH SÁCH
        public IActionResult Index(string keyword = "", int categoryId = 0, int page = 1)
        {
            int pageSize = 10;

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            ViewBag.CategoryId = categoryId;

            var query = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.Status == 1)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }

            if (categoryId > 0)
            {
                query = query.Where(x => x.CategoryProductId == categoryId);
            }

            int totalItems = query.Count();

            var data = query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<Product>
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
        // THÙNG RÁC


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
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product product, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CategoryProducts =
                    _context.CategoriesProducts.ToList();

                return View(product);
            }

            if (imageFile == null)
            {
                ModelState.AddModelError("", "Vui lòng chọn hình ảnh");

                ViewBag.CategoryProducts =
                    _context.CategoriesProducts.ToList();

                return View(product);
            }

            string extension =
                Path.GetExtension(imageFile.FileName).ToLower();

            string[] allowExt =
            {
        ".jpg",
        ".jpeg",
        ".png"
    };

            if (!allowExt.Contains(extension))
            {
                ModelState.AddModelError("",
                    "Chỉ cho phép file JPG, JPEG, PNG");

                ViewBag.CategoryProducts =
                    _context.CategoriesProducts.ToList();

                return View(product);
            }

            string fileName =
                Guid.NewGuid().ToString() + extension;

            string folder =
                Path.Combine(_env.WebRootPath,
                "uploads/products");

            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            string path =
                Path.Combine(folder, fileName);

            using (var stream =
                new FileStream(path, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            product.ImageUrl =
                "/uploads/products/" + fileName;

            product.Status = 1;

            _context.Products.Add(product);
            _context.SaveChanges();

            TempData["success"] =
                "Thêm sản phẩm thành công";

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var product =
                _context.Products.Find(id);

            ViewBag.CategoryProducts =
                _context.CategoriesProducts.ToList();

            return View(product);
        }
        [HttpPost]
        public IActionResult Edit(Product product, IFormFile imageFile)
        {
            var oldProduct = _context.Products.Find(product.Id);

            if (oldProduct == null)
                return NotFound();

            oldProduct.Name = product.Name;
            oldProduct.Description = product.Description;
            oldProduct.Price = product.Price;
            oldProduct.StockQuantity = product.StockQuantity;
            oldProduct.CategoryProductId = product.CategoryProductId;

            if (imageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(imageFile.FileName);

                string path = Path.Combine(
                    _env.WebRootPath,
                    "uploads/products",
                    fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                oldProduct.ImageUrl =
                    "/uploads/products/" + fileName;
            }

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
        public IActionResult Trash(string keyword = "", int categoryId = 0, int page = 1)
        {
            int pageSize = 10;

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            ViewBag.CategoryId = categoryId;

            var query = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.Status == 0)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }

            if (categoryId > 0)
            {
                query = query.Where(x => x.CategoryProductId == categoryId);
            }

            int totalItems = query.Count();

            var data = query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<Product>
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
    }
}