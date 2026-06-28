using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.ViewModel;
namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên,Biên tập viên")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(string keyword = "", int page = 1)
        {
            int pageSize = 5;

            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x =>
                    x.FullName.Contains(keyword) ||
                    x.Email.Contains(keyword) ||
                    x.Phone.Contains(keyword));
            }

            int totalItems = query.Count();

            var data = query
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var model = new PaginationViewModel<Customer>
            {
                Items = data,
                CurrentPage = page,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                PageSize = pageSize,
                Keyword = keyword
            };

            return View(model);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            _context.Customers.Remove(customer);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
        // FORM SỬA
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // LƯU SỬA
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return View(customer);
            }

            _context.Customers.Update(customer);
            _context.SaveChanges();

            TempData["success"] = "Cập nhật khách hàng thành công";

            return RedirectToAction(nameof(Index));
        }
        public IActionResult Details(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }
    }
}