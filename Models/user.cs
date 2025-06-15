using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace online_personal_finance_dashboard.Models;

public partial class User : IdentityUser<Guid>
{

    [StringLength(255)]
    [Unicode(false)]
    public string? first_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? last_name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? phone { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? user_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? password_hash { get; set; }

    public ICollection<UserRole> UserRoles { get; set; }

    [InverseProperty("user")]
    public virtual ICollection<Budget> budgets { get; set; } = new List<Budget>();

    [InverseProperty("user")]
    public virtual ICollection<Debt> debts { get; set; } = new List<Debt>();

    [InverseProperty("user")]
    public virtual ICollection<Expense_category> expense_categories { get; set; } = new List<Expense_category>();

    [InverseProperty("user")]
    public virtual ICollection<Expense> expenses { get; set; } = new List<Expense>();

    [InverseProperty("user")]
    public virtual ICollection<Income> incomes { get; set; } = new List<Income>();

    [InverseProperty("user")]
    public virtual ICollection<Investment_portfolio> investment_portfolios { get; set; } = new List<Investment_portfolio>();

    [InverseProperty("user")]
    public virtual ICollection<Saving> savings { get; set; } = new List<Saving>();
    
    
}
