using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CustomerRepository(AppDbContext context)
    : GenericRepository<Customer>(context), ICustomerRepository
{
    public async Task<Customer?> GetByEmailAsync(string email) =>
        await _context.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Email == email);
}
