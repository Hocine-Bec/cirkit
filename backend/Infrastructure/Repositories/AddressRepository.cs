using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AddressRepository(AppDbContext context)
    : GenericRepository<Address>(context), IAddressRepository
{
    public async Task<IEnumerable<Address>> GetByCustomerIdAsync(Guid customerId) =>
        await _context.Addresses
            .AsNoTracking()
            .Where(a => a.CustomerId == customerId)
            .OrderByDescending(a => a.IsDefault)
            .ToListAsync();
}
