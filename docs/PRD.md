# CirKit: Product Requirements Document (PRD)

## 1. Product Vision
CirKit aims to be a premium, high-performance e-commerce platform dedicated to top-tier electronics. It seeks to provide a frictionless purchasing experience with an aesthetic tailored to tech enthusiasts ("dark tech" theme), distinguishing itself from generic storefronts.

## 2. Target Audience
- **Tech Enthusiasts**: Early adopters looking for the latest gadgets with detailed specs.
- **Professionals**: individuals needing high-end computing and mobile gear.
- **General Consumers**: Users looking for a reliable, fast, and visually appealing place to buy modern electronics.

## 3. Key Features
### 3.1 Storefront (Public)
- **High-Performance Catalog**: Fast filtering, sorting, and pagination of products.
- **Detailed Product Pages**: Including high-res image galleries, rich descriptions, and technical specification tables.
- **Persistent Cart**: Local storage-backed shopping cart with slide-out drawer overview.
- **Seamless Checkout**: Address capture, cart validation, and simulated payment processing via Stripe SDK integration.

### 3.2 Customer Portal
- **Order Tracking**: Detailed history of past and current orders.
- **Address Management**: Saving multiple shipping addresses and setting defaults.
- **Profile Management**: Updating credentials and basic userInfo.

### 3.3 Admin Panel
- **Dashboard**: High-level analytics, revenue charts, and low stock alerts.
- **Product Management**: Full CRUD on categories, products, images, and variants.
- **Order Fulfillment**: Tracking orders from Pending to Delivered, supporting refunds.
- **Customer Moderation**: Viewing customer lifetime value and moderating reviews.

## 4. Success Metrics
- **Performance**: Sub-second page loads leveraging React caching and Vite.
- **Conversion**: Reduced friction at checkout through simplified address mapping and reliable state management.
- **Maintainability**: Strongly typed end-to-end (C# + TypeScript) preventing regressions.
