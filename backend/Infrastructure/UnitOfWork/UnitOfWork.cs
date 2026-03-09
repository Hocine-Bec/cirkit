using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;

namespace Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private ICategoryRepository?       _categories;
    private IProductRepository?        _products;
    private IProductImageRepository?   _productImages;
    private IProductVariantRepository? _productVariants;
    private ICustomerRepository?       _customers;
    private IAddressRepository?        _addresses;
    private IOrderRepository?          _orders;
    private IGenericRepository<OrderItem>? _orderItems;
    private IUserRepository?           _users;
    private IReviewRepository?         _reviews;

    public UnitOfWork(AppDbContext context) => _context = context;

    public ICategoryRepository       Categories     => _categories     ??= new CategoryRepository(_context);
    public IProductRepository        Products       => _products       ??= new ProductRepository(_context);
    public IProductImageRepository   ProductImages  => _productImages  ??= new ProductImageRepository(_context);
    public IProductVariantRepository ProductVariants => _productVariants ??= new ProductVariantRepository(_context);
    public ICustomerRepository       Customers      => _customers      ??= new CustomerRepository(_context);
    public IAddressRepository        Addresses      => _addresses      ??= new AddressRepository(_context);
    public IOrderRepository          Orders         => _orders         ??= new OrderRepository(_context);
    public IGenericRepository<OrderItem> OrderItems => _orderItems     ??= new GenericRepository<OrderItem>(_context);
    public IUserRepository           Users          => _users          ??= new UserRepository(_context);
    public IReviewRepository         Reviews        => _reviews        ??= new ReviewRepository(_context);

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
