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
    public class Investment_price_historyController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public Investment_price_historyController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Investment_price_history
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Investment_price_history>>> Getinvestment_price_histories()
        {
            return await _context.investment_price_histories.ToListAsync();
        }

        // GET: api/Investment_price_history/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Investment_price_history>> GetInvestment_price_history(long id)
        {
            var investment_price_history = await _context.investment_price_histories.FindAsync(id);

            if (investment_price_history == null)
            {
                return NotFound();
            }

            return investment_price_history;
        }

        // PUT: api/Investment_price_history/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment_price_history(long id, Investment_price_history investment_price_history)
        {
            if (id != investment_price_history.id)
            {
                return BadRequest();
            }

            _context.Entry(investment_price_history).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Investment_price_historyExists(id))
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

        // POST: api/Investment_price_history
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Investment_price_history>> PostInvestment_price_history(Investment_price_history investment_price_history)
        {
            _context.investment_price_histories.Add(investment_price_history);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvestment_price_history", new { id = investment_price_history.id }, investment_price_history);
        }

        // DELETE: api/Investment_price_history/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvestment_price_history(long id)
        {
            var investment_price_history = await _context.investment_price_histories.FindAsync(id);
            if (investment_price_history == null)
            {
                return NotFound();
            }

            _context.investment_price_histories.Remove(investment_price_history);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Investment_price_historyExists(long id)
        {
            return _context.investment_price_histories.Any(e => e.id == id);
        }
    }
}
