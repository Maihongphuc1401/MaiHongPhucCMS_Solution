using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/public/categories")]
    [ApiController]
    public class CategoryApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.CategoriesProducts
                .ToListAsync();

            return Ok(categories);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.CategoriesProducts.Add(model);

            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] CategoryProduct model)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
                return NotFound();

            category.Name = model.Name;

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
                return NotFound();

            _context.CategoriesProducts.Remove(category);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Xóa danh mục thành công"
            });
        }
    }
}