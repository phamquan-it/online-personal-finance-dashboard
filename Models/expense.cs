using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Expense
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    public long? category_id { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? amount { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? description { get; set; }

    public DateOnly? transaction_date { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? payment_method { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [ForeignKey("category_id")]
    [InverseProperty("expenses")]
    public virtual Expense_category? category { get; set; }

    [ForeignKey("user_id")]
    [InverseProperty("expenses")]
    public virtual User? user { get; set; }
}
