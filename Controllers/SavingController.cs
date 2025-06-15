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
    [Route("api/saving")]
    [ApiController]
    public class SavingController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public SavingController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Saving
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Saving>>> Getsavings()
        {
            return await _context.savings.ToListAsync();
        }

        // GET: api/Saving/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Saving>> GetSaving(long id)
        {
            var saving = await _context.savings.FindAsync(id);

            if (saving == null)
            {
                return NotFound();
            }

            return saving;
        }

        // PUT: api/Saving/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSaving(long id, Saving saving)
        {
            if (id != saving.id)
            {
                return BadRequest();
            }

            _context.Entry(saving).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavingExists(id))
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

        // POST: api/Saving
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Saving>> PostSaving(Saving saving)
        {
            _context.savings.Add(saving);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSaving", new { id = saving.id }, saving);
        }

        // DELETE: api/Saving/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSaving(long id)
        {
            var saving = await _context.savings.FindAsync(id);
            if (saving == null)
            {
                return NotFound();
            }

            _context.savings.Remove(saving);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SavingExists(long id)
        {
            return _context.savings.Any(e => e.id == id);
        }
    }
}
