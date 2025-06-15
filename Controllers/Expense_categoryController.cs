using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using online_personal_finance_dashboard.Data;
using online_personal_finance_dashboard.Models;

namespace online_personal_finance_dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Expense_categoryController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public Expense_categoryController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Expense_category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense_category>>> Getexpense_categories()
        {
            return await _context.expense_categories.ToListAsync();
        }

        // GET: api/Expense_category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense_category>> GetExpense_category(long id)
        {
            var expense_category = await _context.expense_categories.FindAsync(id);

            if (expense_category == null)
            {
                return NotFound();
            }

            return expense_category;
        }

        // PUT: api/Expense_category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense_category(long id, Expense_category expense_category)
        {
            if (id != expense_category.id)
            {
                return BadRequest();
            }

            _context.Entry(expense_category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Expense_categoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Expense_category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Expense_category>> PostExpense_category(Expense_category expense_category)
        {
            _context.expense_categories.Add(expense_category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpense_category", new { id = expense_category.id }, expense_category);
        }

        // DELETE: api/Expense_category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense_category(long id)
        {
            var expense_category = await _context.expense_categories.FindAsync(id);
            if (expense_category == null)
            {
                return NotFound();
            }

            _context.expense_categories.Remove(expense_category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Expense_categoryExists(long id)
        {
            return _context.expense_categories.Any(e => e.id == id);
        }
    }
}
