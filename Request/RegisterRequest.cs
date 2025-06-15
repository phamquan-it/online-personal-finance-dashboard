using System.ComponentModel.DataAnnotations;

namespace online_personal_finance_dashboard.Request;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = default!;

    [Required]
    public string Password { get; set; } = default!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Phone { get; set; }

    public string? UserName { get; set; }
}
