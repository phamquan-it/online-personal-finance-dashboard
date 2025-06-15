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
    public class Saving_contributionController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public Saving_contributionController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Saving_contribution
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Saving_contribution>>> Getsaving_contributions()
        {
            return await _context.saving_contributions.ToListAsync();
        }

        // GET: api/Saving_contribution/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Saving_contribution>> GetSaving_contribution(long id)
        {
            var saving_contribution = await _context.saving_contributions.FindAsync(id);

            if (saving_contribution == null)
            {
                return NotFound();
            }

            return saving_contribution;
        }

        // PUT: api/Saving_contribution/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSaving_contribution(long id, Saving_contribution saving_contribution)
        {
            if (id != saving_contribution.id)
            {
                return BadRequest();
            }

            _context.Entry(saving_contribution).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Saving_contributionExists(id))
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

        // POST: api/Saving_contribution
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Saving_contribution>> PostSaving_contribution(Saving_contribution saving_contribution)
        {
            _context.saving_contributions.Add(saving_contribution);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSaving_contribution", new { id = saving_contribution.id }, saving_contribution);
        }

        // DELETE: api/Saving_contribution/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSaving_contribution(long id)
        {
            var saving_contribution = await _context.saving_contributions.FindAsync(id);
            if (saving_contribution == null)
            {
                return NotFound();
            }

            _context.saving_contributions.Remove(saving_contribution);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Saving_contributionExists(long id)
        {
            return _context.saving_contributions.Any(e => e.id == id);
        }
    }
}
