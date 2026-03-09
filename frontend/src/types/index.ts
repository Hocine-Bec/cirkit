// === Auth ===
export interface AdminLoginRequest { email: string; password: string; }
export interface AdminLoginResponse { id: string; fullName: string; email: string; role: string; token: string; }
export interface CustomerRegisterRequest { firstName: string; lastName: string; email: string; password: string; }
export interface CustomerLoginRequest { email: string; password: string; }
export interface CustomerLoginResponse { id: string; firstName: string; lastName: string; email: string; token: string; }

// === Category ===
export interface CategoryRequest { name: string; slug: string; description: string; imageUrl: string; displayOrder: number; isActive: boolean; }
export interface CategoryResponse { id: string; name: string; slug: string; description: string; imageUrl: string; displayOrder: number; isActive: boolean; productCount: number; }

// === Product ===
export interface ProductRequest { categoryId: string; name: string; slug: string; description: string; shortDescription: string; basePrice: number; imageUrl: string; brand: string; sku: string; stockQuantity: number; isActive: boolean; isFeatured: boolean; specifications: string; }
export interface ProductResponse { id: string; categoryId: string; categoryName: string; name: string; slug: string; description: string; shortDescription: string; basePrice: number; imageUrl: string; brand: string; sku: string; stockQuantity: number; isActive: boolean; isFeatured: boolean; specifications: string; averageRating: number; reviewCount: number; createdAt: string; updatedAt: string; }
export interface ProductDetailResponse extends ProductResponse { images: ProductImageResponse[]; variants: ProductVariantResponse[]; reviews: ReviewResponse[]; }

export interface ProductImageRequest { imageUrl: string; displayOrder: number; isMain: boolean; }
export interface ProductImageResponse { id: string; productId: string; imageUrl: string; displayOrder: number; isMain: boolean; }

export interface ProductVariantRequest { name: string; sku: string; priceModifier: number; stockQuantity: number; isActive: boolean; }
export interface ProductVariantResponse { id: string; productId: string; name: string; sku: string; priceModifier: number; stockQuantity: number; isActive: boolean; }

export interface PaginatedResponse<T> { items: T[]; totalCount: number; page: number; pageSize: number; totalPages: number; }

// === Customer ===
export interface CustomerResponse { id: string; firstName: string; lastName: string; email: string; phone: string | null; createdAt: string; orderCount: number; totalSpent: number; }
export interface CustomerDetailResponse { id: string; firstName: string; lastName: string; email: string; phone: string | null; createdAt: string; addresses: AddressResponse[]; }
export interface UpdateProfileRequest { firstName: string; lastName: string; email: string; }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string; }

export interface AddressRequest { label: string; street: string; city: string; state: string; zipCode: string; country: string; isDefault: boolean; }
export interface AddressResponse { id: string; customerId: string; label: string; street: string; city: string; state: string; zipCode: string; country: string; isDefault: boolean; }

// === Order ===
export interface OrderResponse { id: string; customerId: string; customerName: string; orderNumber: string; status: string; subTotal: number; shippingCost: number; tax: number; total: number; paymentMethod: string; itemCount: number; createdAt: string; updatedAt: string; }
export interface OrderDetailResponse extends OrderResponse { customerEmail: string; stripePaymentIntentId: string | null; shippingAddressSnapshot: string; notes: string | null; items: OrderItemResponse[]; }
export interface OrderItemResponse { id: string; productId: string; productVariantId: string | null; productName: string; variantName: string | null; unitPrice: number; quantity: number; total: number; }
export interface UpdateOrderStatusRequest { status: string; }

// === Checkout ===
export interface CheckoutRequest { items: CheckoutItemRequest[]; shippingAddress: ShippingAddressRequest; notes?: string; }
export interface CheckoutItemRequest { productId: string; productVariantId?: string; quantity: number; }
export interface ShippingAddressRequest { street: string; city: string; state: string; zipCode: string; country: string; }
export interface CheckoutResponse { orderId: string; orderNumber: string; total: number; clientSecret: string | null; paymentMethod: string; }

// === Cart ===
export interface ValidateCartRequest { items: CartItemRequest[]; }
export interface CartItemRequest { productId: string; productVariantId?: string; quantity: number; }
export interface ValidateCartResponse { items: ValidatedCartItem[]; isValid: boolean; errors: string[]; }
export interface ValidatedCartItem { productId: string; productVariantId: string | null; productName: string; variantName: string | null; unitPrice: number; quantity: number; availableStock: number; isAvailable: boolean; imageUrl: string; }

// === Review ===
export interface ReviewRequest { rating: number; title: string; comment: string; }
export interface ReviewResponse { id: string; productId: string; customerId: string; customerName: string; rating: number; title: string; comment: string; isVerifiedPurchase: boolean; createdAt: string; }

// === Analytics ===
export interface OverviewResponse { totalRevenue: number; todayRevenue: number; totalOrders: number; totalCustomers: number; averageOrderValue: number; pendingOrders: number; }
export interface DailyRevenueResponse { date: string; revenue: number; }
export interface OrdersByStatusResponse { status: string; count: number; }

// === Cart (client-side) ===
export interface CartItem {
    productId: string;
    variantId?: string;
    name: string;
    variantName?: string;
    price: number;
    quantity: number;
    imageUrl: string;
    maxStock: number;
    slug: string;
}

// === API Error ===
export interface ApiError { detail: string; status?: number; }
