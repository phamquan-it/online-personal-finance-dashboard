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
    public class DebtController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public DebtController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Debt
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Debt>>> Getdebts()
        {
            return await _context.debts.ToListAsync();
        }

        // GET: api/Debt/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Debt>> GetDebt(long id)
        {
            var debt = await _context.debts.FindAsync(id);

            if (debt == null)
            {
                return NotFound();
            }

            return debt;
        }

        // PUT: api/Debt/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDebt(long id, Debt debt)
        {
            if (id != debt.id)
            {
                return BadRequest();
            }

            _context.Entry(debt).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DebtExists(id))
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

        // POST: api/Debt
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Debt>> PostDebt(Debt debt)
        {
            _context.debts.Add(debt);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDebt", new { id = debt.id }, debt);
        }

        // DELETE: api/Debt/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDebt(long id)
        {
            var debt = await _context.debts.FindAsync(id);
            if (debt == null)
            {
                return NotFound();
            }

            _context.debts.Remove(debt);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DebtExists(long id)
        {
            return _context.debts.Any(e => e.id == id);
        }
    }
}
