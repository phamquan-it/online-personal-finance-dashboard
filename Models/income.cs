using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Income
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? income_type { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? frequency { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? amount { get; set; }

    public DateOnly? received_date { get; set; }

    [Column(TypeName = "text")]
    public string? description { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [ForeignKey("user_id")]
    [InverseProperty("incomes")]
    public virtual User? user { get; set; }
}
