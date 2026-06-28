using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.ViewModel;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên,Biên tập viên")]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PostController(
            ApplicationDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // DANH SÁCH
        public IActionResult Index(string keyword = "", int page = 1)
        {
            int pageSize = 5;

            var query = _context.Posts
                .Include(x => x.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.Title.Contains(keyword));
            }

            int totalItems = query.Count();

            var posts = query
                .OrderByDescending(x => x.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<Post>
            {
                Items = posts,
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
            var post = _context.Posts
                .Include(x => x.Category)
                .FirstOrDefault(x => x.Id == id);

            return View(post);
        }

        // FORM THÊM
        public IActionResult Create()
        {
            ViewBag.Categories =
                _context.Categories.ToList();

            return View();
        }

        // LƯU THÊM
        [HttpPost]
        public IActionResult Create(Post post, IFormFile imageFile)
        {
            if (imageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(imageFile.FileName);

                string path = Path.Combine(
                    _env.WebRootPath,
                    "uploads/posts",
                    fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                post.ImageUrl =
                    "/uploads/posts/" + fileName;
            }

            post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            ViewBag.Categories =
                _context.Categories.ToList();

            return View(post);
        }

        // LƯU SỬA
        [HttpPost]
        public IActionResult Edit(Post post, IFormFile imageFile)
        {
            var oldPost = _context.Posts.Find(post.Id);

            oldPost.Title = post.Title;
            oldPost.Content = post.Content;
            oldPost.CategoryId = post.CategoryId;

            if (imageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(imageFile.FileName);

                string path = Path.Combine(
                    _env.WebRootPath,
                    "uploads/posts",
                    fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                oldPost.ImageUrl =
                    "/uploads/posts/" + fileName;
            }

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // XÓA
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            _context.Posts.Remove(post);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}