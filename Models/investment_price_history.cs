using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

[Table("investment_price_history")]
public partial class Investment_price_history
{
    [Key]
    public long id { get; set; }

    public long? investment_id { get; set; }

    public DateOnly? recorded_date { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? price { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [ForeignKey("investment_id")]
    [InverseProperty("investment_price_histories")]
    public virtual Investment? investment { get; set; }
}
