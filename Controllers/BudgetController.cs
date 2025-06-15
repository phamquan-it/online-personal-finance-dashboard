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
    public class BudgetController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public BudgetController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Budget
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> Getbudgets()
        {
            return await _context.budgets.ToListAsync();
        }

        // GET: api/Budget/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> GetBudget(long id)
        {
            var budget = await _context.budgets.FindAsync(id);

            if (budget == null)
            {
                return NotFound();
            }

            return budget;
        }

        // PUT: api/Budget/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(long id, Budget budget)
        {
            if (id != budget.id)
            {
                return BadRequest();
            }

            _context.Entry(budget).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id))
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

        // POST: api/Budget
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Budget>> PostBudget(Budget budget)
        {
            _context.budgets.Add(budget);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBudget", new { id = budget.id }, budget);
        }

        // DELETE: api/Budget/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(long id)
        {
            var budget = await _context.budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound();
            }

            _context.budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BudgetExists(long id)
        {
            return _context.budgets.Any(e => e.id == id);
        }
    }
}
