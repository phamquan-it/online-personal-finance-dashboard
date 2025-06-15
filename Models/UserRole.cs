using Microsoft.AspNetCore.Identity;
using System;

namespace online_personal_finance_dashboard.Models;

public class UserRole : IdentityUserRole<Guid>
{
    public required User User { get; set; }
    public required Role Role { get; set; }
}
