using Microsoft.AspNetCore.Identity;

namespace online_personal_finance_dashboard.Models
{
     public class Role : IdentityRole<Guid>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}