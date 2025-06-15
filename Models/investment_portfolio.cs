using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Investment_portfolio
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

    [InverseProperty("portfolio")]
    public virtual ICollection<Investment> investments { get; set; } = new List<Investment>();

    [ForeignKey("user_id")]
    [InverseProperty("investment_portfolios")]
    public virtual User? user { get; set; }
}
