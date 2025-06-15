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
    public class InvestmentController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public InvestmentController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Investment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Investment>>> Getinvestments()
        {
            return await _context.investments.ToListAsync();
        }

        // GET: api/Investment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Investment>> GetInvestment(long id)
        {
            var investment = await _context.investments.FindAsync(id);

            if (investment == null)
            {
                return NotFound();
            }

            return investment;
        }

        // PUT: api/Investment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment(long id, Investment investment)
        {
            if (id != investment.id)
            {
                return BadRequest();
            }

            _context.Entry(investment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvestmentExists(id))
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

        // POST: api/Investment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Investment>> PostInvestment(Investment investment)
        {
            _context.investments.Add(investment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvestment", new { id = investment.id }, investment);
        }

        // DELETE: api/Investment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvestment(long id)
        {
            var investment = await _context.investments.FindAsync(id);
            if (investment == null)
            {
                return NotFound();
            }

            _context.investments.Remove(investment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvestmentExists(long id)
        {
            return _context.investments.Any(e => e.id == id);
        }
    }
}
