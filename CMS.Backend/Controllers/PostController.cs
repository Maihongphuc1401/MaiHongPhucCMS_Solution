using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        public IActionResult Index()
        {
            // Dữ liệu mẫu
            var list = new List<Post>
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

            return View(list);
        }
    }
}