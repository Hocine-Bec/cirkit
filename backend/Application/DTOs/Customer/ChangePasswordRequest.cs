namespace Application.DTOs.Customer;
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
