export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const ITEMS_PER_PAGE = 12;
export const SHIPPING_THRESHOLD = 99; // Free shipping over $99
export const SHIPPING_COST = 9.99;
export const TAX_RATE = 0.085; // 8.5%

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
] as const;
