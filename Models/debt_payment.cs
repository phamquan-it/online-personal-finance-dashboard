using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Debt_payment
{
    [Key]
    public long id { get; set; }

    public long? debt_id { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? payment_amount { get; set; }

    public DateOnly? payment_date { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? principal_amount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? interest_amount { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [ForeignKey("debt_id")]
    [InverseProperty("debt_payments")]
    public virtual Debt? debt { get; set; }
}
