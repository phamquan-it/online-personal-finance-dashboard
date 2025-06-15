using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Investment
{
    [Key]
    public long id { get; set; }

    public long? portfolio_id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? asset_type { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? purchase_price { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? current_price { get; set; }

    public DateOnly? purchase_date { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [InverseProperty("investment")]
    public virtual ICollection<Investment_price_history> investment_price_histories { get; set; } = new List<Investment_price_history>();

    [ForeignKey("portfolio_id")]
    [InverseProperty("investments")]
    public virtual Investment_portfolio? portfolio { get; set; }
}
