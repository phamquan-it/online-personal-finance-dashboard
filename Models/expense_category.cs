using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Expense_category
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? name { get; set; }

    [Column(TypeName = "text")]
    public string? description { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [InverseProperty("category")]
    public virtual ICollection<Budget> budgets { get; set; } = new List<Budget>();

    [InverseProperty("category")]
    public virtual ICollection<Expense> expenses { get; set; } = new List<Expense>();

    [ForeignKey("user_id")]
    [InverseProperty("expense_categories")]
    public virtual User? user { get; set; }
}
