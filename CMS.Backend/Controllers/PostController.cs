using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // Dữ liệu mẫu
        static List<Post> list = new List<Post>
        {
            new Post
            {
                Id = 1,
                Title = "ASP.NET Core MVC",
                Content = "Học ASP.NET Core MVC từ cơ bản đến nâng cao",
                ImageUrl = "https://via.placeholder.com/120",
                CreatedDate = DateTime.Now,
                CategoryId = 1
            },

            new Post
            {
                Id = 2,
                Title = "Lập trình C#",
                Content = "Các kiến thức nền tảng về C#",
                ImageUrl = "https://via.placeholder.com/120",
                CreatedDate = DateTime.Now,
                CategoryId = 2
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
            var post = list.FirstOrDefault(x => x.Id == id);

            return View(post);
        }

        // FORM THÊM
        public IActionResult Create()
        {
            return View();
        }

        // LƯU THÊM
        [HttpPost]
        public IActionResult Create(Post post)
        {
            post.Id = list.Max(x => x.Id) + 1;

            post.CreatedDate = DateTime.Now;

            list.Add(post);

            return RedirectToAction("Index");
        }

        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var post = list.FirstOrDefault(x => x.Id == id);

            return View(post);
        }

        // LƯU SỬA
        [HttpPost]
        public IActionResult Edit(Post post)
        {
            var oldPost = list.FirstOrDefault(x => x.Id == post.Id);

            oldPost.Title = post.Title;
            oldPost.Content = post.Content;
            oldPost.ImageUrl = post.ImageUrl;
            oldPost.CategoryId = post.CategoryId;

            return RedirectToAction("Index");
        }

        // XÓA
        public IActionResult Delete(int id)
        {
            var post = list.FirstOrDefault(x => x.Id == id);

            list.Remove(post);

            return RedirectToAction("Index");
        }
    }
}