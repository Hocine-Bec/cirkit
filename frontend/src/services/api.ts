import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import type {
    AdminLoginRequest, AdminLoginResponse,
    CustomerRegisterRequest, CustomerLoginRequest, CustomerLoginResponse,
    CategoryRequest, CategoryResponse,
    ProductRequest, ProductResponse, ProductDetailResponse, PaginatedResponse,
    ProductImageRequest, ProductImageResponse,
    ProductVariantRequest, ProductVariantResponse,
    CustomerResponse, CustomerDetailResponse,
    UpdateProfileRequest, ChangePasswordRequest,
    AddressRequest, AddressResponse,
    OrderResponse, OrderDetailResponse, UpdateOrderStatusRequest,
    CheckoutRequest, CheckoutResponse,
    ValidateCartRequest, ValidateCartResponse,
    ReviewRequest, ReviewResponse,
    OverviewResponse, DailyRevenueResponse, OrdersByStatusResponse,
} from '@/types';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach JWT token
api.interceptors.request.use((config) => {
    // Check admin token first, then customer token
    const adminToken = localStorage.getItem('admin_token');
    const customerToken = localStorage.getItem('customer_token');
    const token = adminToken || customerToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            if (path.startsWith('/admin')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = '/admin/login';
            } else if (path.startsWith('/account')) {
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer_user');
                window.location.href = '/account/login';
            }
        }
        return Promise.reject(error);
    }
);

// === Auth ===
export const authApi = {
    adminLogin: (data: AdminLoginRequest) =>
        api.post<AdminLoginResponse>('/auth/admin/login', data).then(r => r.data),
    register: (data: CustomerRegisterRequest) =>
        api.post<CustomerLoginResponse>('/auth/register', data).then(r => r.data),
    login: (data: CustomerLoginRequest) =>
        api.post<CustomerLoginResponse>('/auth/login', data).then(r => r.data),
};

// === Categories ===
export const categoriesApi = {
    getAll: () => api.get<CategoryResponse[]>('/categories').then(r => r.data),
    getBySlug: (slug: string) => api.get<CategoryResponse>(`/categories/${slug}`).then(r => r.data),
    create: (data: CategoryRequest) => api.post<CategoryResponse>('/categories', data).then(r => r.data),
    update: (id: string, data: CategoryRequest) => api.put<CategoryResponse>(`/categories/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

// === Products ===
export const productsApi = {
    getFiltered: (params: { categoryId?: string; brand?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; sortBy?: string; page?: number; pageSize?: number }) =>
        api.get<PaginatedResponse<ProductResponse>>('/products', { params }).then(r => r.data),
    getBySlug: (slug: string) => api.get<ProductDetailResponse>(`/products/${slug}`).then(r => r.data),
    getFeatured: () => api.get<ProductResponse[]>('/products/featured').then(r => r.data),
    getNewArrivals: () => api.get<ProductResponse[]>('/products/new-arrivals').then(r => r.data),
    create: (data: ProductRequest) => api.post<ProductResponse>('/products', data).then(r => r.data),
    update: (id: string, data: ProductRequest) => api.put<ProductResponse>(`/products/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/products/${id}`),
    // Images
    addImage: (productId: string, data: ProductImageRequest) => api.post<ProductImageResponse>(`/products/${productId}/images`, data).then(r => r.data),
    updateImage: (productId: string, imageId: string, data: ProductImageRequest) => api.put<ProductImageResponse>(`/products/${productId}/images/${imageId}`, data).then(r => r.data),
    deleteImage: (productId: string, imageId: string) => api.delete(`/products/${productId}/images/${imageId}`),
    // Variants
    addVariant: (productId: string, data: ProductVariantRequest) => api.post<ProductVariantResponse>(`/products/${productId}/variants`, data).then(r => r.data),
    updateVariant: (productId: string, variantId: string, data: ProductVariantRequest) => api.put<ProductVariantResponse>(`/products/${productId}/variants/${variantId}`, data).then(r => r.data),
    deleteVariant: (productId: string, variantId: string) => api.delete(`/products/${productId}/variants/${variantId}`),
};

// === Reviews ===
export const reviewsApi = {
    getByProduct: (productId: string) => api.get<ReviewResponse[]>(`/products/${productId}/reviews`).then(r => r.data),
    create: (productId: string, data: ReviewRequest) => api.post<ReviewResponse>(`/products/${productId}/reviews`, data).then(r => r.data),
    getAll: () => api.get<ReviewResponse[]>('/admin/reviews').then(r => r.data),
    delete: (id: string) => api.delete(`/admin/reviews/${id}`),
};

// === Cart ===
export const cartApi = {
    validate: (data: ValidateCartRequest) => api.post<ValidateCartResponse>('/cart/validate', data).then(r => r.data),
};

// === Checkout ===
export const checkoutApi = {
    checkout: (data: CheckoutRequest) => api.post<CheckoutResponse>('/checkout', data).then(r => r.data),
};

// === Customer Orders ===
export const customerOrdersApi = {
    getMyOrders: () => api.get<OrderResponse[]>('/orders/my').then(r => r.data),
    getMyOrderDetail: (id: string) => api.get<OrderDetailResponse>(`/orders/my/${id}`).then(r => r.data),
};

// === Customer Account ===
export const accountApi = {
    getProfile: () => api.get<CustomerDetailResponse>('/account/profile').then(r => r.data),
    updateProfile: (data: UpdateProfileRequest) => api.put('/account/profile', data),
    changePassword: (data: ChangePasswordRequest) => api.put('/account/password', data),
    getAddresses: () => api.get<AddressResponse[]>('/account/addresses').then(r => r.data),
    addAddress: (data: AddressRequest) => api.post<AddressResponse>('/account/addresses', data).then(r => r.data),
    updateAddress: (id: string, data: AddressRequest) => api.put<AddressResponse>(`/account/addresses/${id}`, data).then(r => r.data),
    deleteAddress: (id: string) => api.delete(`/account/addresses/${id}`),
};

// === Admin Orders ===
export const adminOrdersApi = {
    getAll: (params: { status?: string; fromDate?: string; toDate?: string; page?: number; pageSize?: number }) =>
        api.get<PaginatedResponse<OrderResponse>>('/admin/orders', { params }).then(r => r.data),
    getById: (id: string) => api.get<OrderDetailResponse>(`/admin/orders/${id}`).then(r => r.data),
    updateStatus: (id: string, data: UpdateOrderStatusRequest) => api.patch<OrderDetailResponse>(`/admin/orders/${id}/status`, data).then(r => r.data),
    refund: (id: string) => api.post(`/admin/orders/${id}/refund`),
};

// === Admin Customers ===
export const adminCustomersApi = {
    getAll: () => api.get<CustomerResponse[]>('/admin/customers').then(r => r.data),
    getById: (id: string) => api.get<CustomerDetailResponse>(`/admin/customers/${id}`).then(r => r.data),
};

// === Admin Analytics ===
export const analyticsApi = {
    getOverview: () => api.get<OverviewResponse>('/admin/analytics/overview').then(r => r.data),
    getDailyRevenue: (days: number = 30) => api.get<DailyRevenueResponse[]>('/admin/analytics/revenue', { params: { days } }).then(r => r.data),
    getOrdersByStatus: () => api.get<OrdersByStatusResponse[]>('/admin/analytics/orders-by-status').then(r => r.data),
};

export default api;
