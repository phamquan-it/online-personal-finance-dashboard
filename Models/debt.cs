using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Debt
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? debt_name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? debt_type { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? total_amount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? remaining_amount { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? interest_rate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? minimum_payment { get; set; }

    public DateOnly? due_date { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? payment_frequency { get; set; }

    public bool? is_completed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [InverseProperty("debt")]
    public virtual ICollection<Debt_payment> debt_payments { get; set; } = new List<Debt_payment>();

    [ForeignKey("user_id")]
    [InverseProperty("debts")]
    public virtual User? user { get; set; }
}
