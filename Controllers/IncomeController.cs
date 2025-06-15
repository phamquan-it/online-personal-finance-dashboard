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
    public class IncomeController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public IncomeController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Income
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Income>>> Getincomes()
        {
            return await _context.incomes.ToListAsync();
        }

        // GET: api/Income/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Income>> GetIncome(long id)
        {
            var income = await _context.incomes.FindAsync(id);

            if (income == null)
            {
                return NotFound();
            }

            return income;
        }

        // PUT: api/Income/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncome(long id, Income income)
        {
            if (id != income.id)
            {
                return BadRequest();
            }

            _context.Entry(income).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncomeExists(id))
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

        // POST: api/Income
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Income>> PostIncome(Income income)
        {
            _context.incomes.Add(income);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIncome", new { id = income.id }, income);
        }

        // DELETE: api/Income/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(long id)
        {
            var income = await _context.incomes.FindAsync(id);
            if (income == null)
            {
                return NotFound();
            }

            _context.incomes.Remove(income);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IncomeExists(long id)
        {
            return _context.incomes.Any(e => e.id == id);
        }
    }
}
