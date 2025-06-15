using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class Saving_contribution
{
    [Key]
    public long id { get; set; }

    public long? saving_id { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? amount { get; set; }

    public DateOnly? contribution_date { get; set; }

    [Column(TypeName = "text")]
    public string? note { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [ForeignKey("saving_id")]
    [InverseProperty("saving_contributions")]
    public virtual Saving? saving { get; set; }
}
