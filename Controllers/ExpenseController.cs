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
    public class ExpenseController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public ExpenseController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Expense
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> Getexpenses()
        {
            return await _context.expenses.ToListAsync();
        }

        // GET: api/Expense/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(long id)
        {
            var expense = await _context.expenses.FindAsync(id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // PUT: api/Expense/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(long id, Expense expense)
        {
            if (id != expense.id)
            {
                return BadRequest();
            }

            _context.Entry(expense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
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

        // POST: api/Expense
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            _context.expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpense", new { id = expense.id }, expense);
        }

        // DELETE: api/Expense/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(long id)
        {
            var expense = await _context.expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExpenseExists(long id)
        {
            return _context.expenses.Any(e => e.id == id);
        }
    }
}
