using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;
public partial class Saving
{
    [Key]
    public long id { get; set; }

    public Guid? user_id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? title { get; set; }

    [Column(TypeName = "text")]
    public string? description { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? target_amount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? current_amount { get; set; }

    public DateOnly? target_date { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? goal_type { get; set; }

    public bool? is_completed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? created_at { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? updated_at { get; set; }

    [InverseProperty("saving")]
    public virtual ICollection<Saving_contribution> saving_contributions { get; set; } = new List<Saving_contribution>();

    [ForeignKey("user_id")]
    [InverseProperty("savings")]
    public virtual User? user { get; set; }
}
