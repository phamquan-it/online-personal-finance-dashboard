using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using online_personal_finance_dashboard.Models;

namespace online_personal_finance_dashboard.Data;

public partial class FinancialAppDbContext : IdentityDbContext<
    User,
    Role,
    Guid,
    IdentityUserClaim<Guid>,
    UserRole,
    IdentityUserLogin<Guid>,
    IdentityRoleClaim<Guid>,
    IdentityUserToken<Guid>
>
{
    public FinancialAppDbContext()
    {
    }

    public FinancialAppDbContext(DbContextOptions<FinancialAppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Budget> budgets { get; set; }
    public virtual DbSet<Debt> debts { get; set; }
    public virtual DbSet<Debt_payment> debt_payments { get; set; }
    public virtual DbSet<Expense> expenses { get; set; }
    public virtual DbSet<Expense_category> expense_categories { get; set; }
    public virtual DbSet<Income> incomes { get; set; }
    public virtual DbSet<Investment> investments { get; set; }
    public virtual DbSet<Investment_portfolio> investment_portfolios { get; set; }
    public virtual DbSet<Investment_price_history> investment_price_histories { get; set; }
    public virtual DbSet<Saving> savings { get; set; }
    public virtual DbSet<Saving_contribution> saving_contributions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultDbContext");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Mapping UserRole composite key
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(ur => new { ur.UserId, ur.RoleId });

            entity.HasOne(ur => ur.User)
                  .WithMany(u => u.UserRoles)
                  .HasForeignKey(ur => ur.UserId)
                  .IsRequired();

            entity.HasOne(ur => ur.Role)
                  .WithMany(r => r.UserRoles)
                  .HasForeignKey(ur => ur.RoleId)
                  .IsRequired();
        });

        modelBuilder.Entity<Budget>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__budgets__3213E83FC68C122A");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.category).WithMany(p => p.budgets).HasConstraintName("FK_budgets_expense_categories");

            entity.HasOne(d => d.user).WithMany(p => p.budgets).HasConstraintName("FK_budgets_users");
        });

        modelBuilder.Entity<Debt>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__debts__3213E83FE8F84B86");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.user).WithMany(p => p.debts).HasConstraintName("FK_debts_users");
        });

        modelBuilder.Entity<Debt_payment>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__debt_pay__3213E83FA4BEACBA");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.debt).WithMany(p => p.debt_payments).HasConstraintName("FK_debt_payments_debts");
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__expenses__3213E83FFC6837CC");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.category).WithMany(p => p.expenses).HasConstraintName("FK_expenses_expense_categories");

            entity.HasOne(d => d.user).WithMany(p => p.expenses).HasConstraintName("FK_expenses_users");
        });

        modelBuilder.Entity<Expense_category>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__expense___3213E83FD19938B3");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.user).WithMany(p => p.expense_categories).HasConstraintName("FK_expense_categories_users");
        });

        modelBuilder.Entity<Income>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__incomes__3213E83F433D8B6B");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.user).WithMany(p => p.incomes).HasConstraintName("FK_incomes_users");
        });

        modelBuilder.Entity<Investment>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__investme__3213E83FE0A61AFE");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.portfolio).WithMany(p => p.investments).HasConstraintName("FK_investments_portfolios");
        });

        modelBuilder.Entity<Investment_portfolio>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__investme__3213E83FAEA03A6F");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.user).WithMany(p => p.investment_portfolios).HasConstraintName("FK_investment_portfolios_users");
        });

        modelBuilder.Entity<Investment_price_history>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__investme__3213E83F7ADBEE21");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.investment).WithMany(p => p.investment_price_histories).HasConstraintName("FK_investment_price_history_investments");
        });

        modelBuilder.Entity<Saving>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__savings__3213E83F844BBBF0");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.user).WithMany(p => p.savings).HasConstraintName("FK_savings_users");
        });

        modelBuilder.Entity<Saving_contribution>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK__saving_c__3213E83F6A979BC6");

            entity.Property(e => e.created_at).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.updated_at).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.saving).WithMany(p => p.saving_contributions).HasConstraintName("FK_saving_contributions_savings");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
