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
    public class Investment_portfolioController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public Investment_portfolioController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Investment_portfolio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Investment_portfolio>>> Getinvestment_portfolios()
        {
            return await _context.investment_portfolios.ToListAsync();
        }

        // GET: api/Investment_portfolio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Investment_portfolio>> GetInvestment_portfolio(long id)
        {
            var investment_portfolio = await _context.investment_portfolios.FindAsync(id);

            if (investment_portfolio == null)
            {
                return NotFound();
            }

            return investment_portfolio;
        }

        // PUT: api/Investment_portfolio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment_portfolio(long id, Investment_portfolio investment_portfolio)
        {
            if (id != investment_portfolio.id)
            {
                return BadRequest();
            }

            _context.Entry(investment_portfolio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Investment_portfolioExists(id))
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

        // POST: api/Investment_portfolio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Investment_portfolio>> PostInvestment_portfolio(Investment_portfolio investment_portfolio)
        {
            _context.investment_portfolios.Add(investment_portfolio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvestment_portfolio", new { id = investment_portfolio.id }, investment_portfolio);
        }

        // DELETE: api/Investment_portfolio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvestment_portfolio(long id)
        {
            var investment_portfolio = await _context.investment_portfolios.FindAsync(id);
            if (investment_portfolio == null)
            {
                return NotFound();
            }

            _context.investment_portfolios.Remove(investment_portfolio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Investment_portfolioExists(long id)
        {
            return _context.investment_portfolios.Any(e => e.id == id);
        }
    }
}
