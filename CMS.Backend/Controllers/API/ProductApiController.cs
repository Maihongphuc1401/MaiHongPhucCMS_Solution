using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/public/products")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.Status == 1)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.Price,
                    x.StockQuantity,
                    x.ImageUrl,
                    CategoryName = x.CategoryProduct.Name
                })
                .ToList();

            return Ok(products);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.Price,
                    x.StockQuantity,
                    x.ImageUrl,
                    CategoryName = x.CategoryProduct.Name
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound();

            return Ok(product);
        }
    }
}