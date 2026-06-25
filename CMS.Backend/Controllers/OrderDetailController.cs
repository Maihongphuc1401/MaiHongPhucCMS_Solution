using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Quản trị viên")]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult ByOrder(int id)
        {
            var orderDetails = _context.OrderDetails
                .Include(x => x.Product)
                .Include(x => x.Order)
                .Where(x => x.OrderId == id)
                .ToList();

            ViewBag.OrderId = id;

            return View(orderDetails);
        }
    }
}