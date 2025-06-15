using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Budget
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    public long? category_id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? budget_type { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? amount { get; set; }

    public DateOnly? start_date { get; set; }

    public DateOnly? end_date { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? alert_threshold { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [ForeignKey("category_id")]
    [InverseProperty("budgets")]
    public virtual Expense_category? category { get; set; }

    [ForeignKey("user_id")]
    [InverseProperty("budgets")]
    public virtual User? user { get; set; }
}
