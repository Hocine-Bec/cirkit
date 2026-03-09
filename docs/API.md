# CirKit API Documentation

## Base URL
Production: `https://your-railway-app.up.railway.app/api`
Local: `http://localhost:5017/api`

## Authentication
JWT Bearer token required for protected routes.
Header format: `Authorization: Bearer <token>`

## Endpoints

### Account
- `POST /account/register` - Create customer account
- `POST /account/login` - Authenticate customer, receive JWT
- `POST /account/admin-login` - Authenticate admin, receive JWT
- `GET /account/profile` - Get current customer profile
- `PUT /account/profile` - Update profile
- `GET /account/addresses` - Get customer shipping addresses
- `POST /account/addresses` - Add shipping address

### Products & Categories
- `GET /products` - List all active products (paginated, sortable, filterable)
- `GET /products/{slug}` - Get product details, variants, images, and reviews
- `GET /categories` - List all active categories

### Cart & Checkout
- `POST /cart/validate` - Validate cart items against current stock and prices
- `POST /checkout` - Process order and generate mock Stripe intent

### Orders (Customer)
- `GET /orders/my` - List customer's orders
- `GET /orders/my/{id}` - Get specific order details

### Admin (Requires Admin JWT)
- `GET /admin/analytics/overview` - Dashboard statistics
- `GET /admin/analytics/revenue` - Revenue chart data
- `GET /admin/orders` - Management view of all orders
- `PATCH /admin/orders/{id}/status` - Update order status (Pending → Processing → Shipped → Delivered)
- `POST /admin/products` - Create new product
- `PUT /admin/products/{id}` - Update product
- `GET /admin/customers` - View customer accounts and metrics
- `GET /admin/reviews` - Moderate product reviews
