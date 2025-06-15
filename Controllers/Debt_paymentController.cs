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
    public class Debt_paymentController : ControllerBase
    {
        private readonly FinancialAppDbContext _context;

        public Debt_paymentController(FinancialAppDbContext context)
        {
            _context = context;
        }

        // GET: api/Debt_payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Debt_payment>>> Getdebt_payments()
        {
            return await _context.debt_payments.ToListAsync();
        }

        // GET: api/Debt_payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Debt_payment>> GetDebt_payment(long id)
        {
            var debt_payment = await _context.debt_payments.FindAsync(id);

            if (debt_payment == null)
            {
                return NotFound();
            }

            return debt_payment;
        }

        // PUT: api/Debt_payment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDebt_payment(long id, Debt_payment debt_payment)
        {
            if (id != debt_payment.id)
            {
                return BadRequest();
            }

            _context.Entry(debt_payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Debt_paymentExists(id))
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

        // POST: api/Debt_payment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Debt_payment>> PostDebt_payment(Debt_payment debt_payment)
        {
            _context.debt_payments.Add(debt_payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDebt_payment", new { id = debt_payment.id }, debt_payment);
        }

        // DELETE: api/Debt_payment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDebt_payment(long id)
        {
            var debt_payment = await _context.debt_payments.FindAsync(id);
            if (debt_payment == null)
            {
                return NotFound();
            }

            _context.debt_payments.Remove(debt_payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Debt_paymentExists(long id)
        {
            return _context.debt_payments.Any(e => e.id == id);
        }
    }
}
